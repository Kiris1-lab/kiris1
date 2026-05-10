import { KMSClient, CreateKeyCommand, CreateAliasCommand } from "@aws-sdk/client-kms";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@kiris/db";
import { loadEnv } from "../env.js";

/**
 * Per-tenant CMK allocator. Called from the HIPAA upgrade flow (and from a
 * reconciler that retries failed allocations). PHI uploads are gated on
 * `tenants.hipaa_kms_key_arn` being non-null, so the upgrade endpoint
 * returns immediately with the BAA accepted state and PHI flows unblock as
 * soon as this completes.
 *
 * Idempotent: if `tenants.hipaa_kms_key_arn` is already set, this is a no-op.
 */

let _client: KMSClient | undefined;
function getKmsClient(): KMSClient {
  if (_client) return _client;
  const env = loadEnv();
  _client = new KMSClient({ region: env.AWS_REGION });
  return _client;
}

export async function allocateTenantCmk(tenantId: string): Promise<{ keyArn: string }> {
  const db = getDb();
  const [tenant] = await db
    .select({
      id: schema.tenants.id,
      keyArn: schema.tenants.hipaaKmsKeyArn,
      hipaaEnabled: schema.tenants.hipaaEnabled,
    })
    .from(schema.tenants)
    .where(eq(schema.tenants.id, tenantId))
    .limit(1);
  if (!tenant) throw new Error(`tenant ${tenantId} not found`);
  if (tenant.keyArn) return { keyArn: tenant.keyArn };
  if (!tenant.hipaaEnabled) {
    throw new Error(`tenant ${tenantId} is not HIPAA-enabled; refusing CMK allocation`);
  }

  const client = getKmsClient();
  const created = await client.send(
    new CreateKeyCommand({
      Description: `Kiris tenant ${tenantId} HIPAA CMK`,
      KeyUsage: "ENCRYPT_DECRYPT",
      KeySpec: "SYMMETRIC_DEFAULT",
      Tags: [
        { TagKey: "tenant_id", TagValue: tenantId },
        { TagKey: "kiris:tier", TagValue: "hipaa" },
      ],
    }),
  );
  const keyArn = created.KeyMetadata?.Arn;
  const keyId = created.KeyMetadata?.KeyId;
  if (!keyArn || !keyId) throw new Error("KMS CreateKey returned no ARN");

  // Alias for ops convenience; unique per tenant.
  await client.send(
    new CreateAliasCommand({
      AliasName: `alias/kiris-tenant-${tenantId}`,
      TargetKeyId: keyId,
    }),
  );

  await db
    .update(schema.tenants)
    .set({ hipaaKmsKeyArn: keyArn })
    .where(eq(schema.tenants.id, tenantId));

  return { keyArn };
}
