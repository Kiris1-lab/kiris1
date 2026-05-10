import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { loadEnv } from "../env.js";

/**
 * S3 client for export ZIP uploads + signed-URL downloads.
 *
 * Hard rules (DESIGN §6.4, §12):
 *   - SSE-KMS with the customer-managed CMK (Standard) or the per-tenant
 *     CMK (HIPAA, when allocated by the upgrade endpoint).
 *   - Signed URLs ≤ 5-minute expiry.
 *   - No public ACLs — bucket policy in `infra/modules/s3` rejects
 *     non-encrypted PUTs.
 */

let _client: S3Client | undefined;

function getClient(): S3Client {
  if (_client) return _client;
  const env = loadEnv();
  _client = new S3Client({
    region: env.AWS_REGION,
    // Don't auto-add CRC32/CRC64 checksums to every request — KMS handles
    // integrity at rest. Saves ~50ms per request and trims CPU on big PUTs.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return _client;
}

export interface PutExportInput {
  bucket: string;
  key: string;
  bytes: Uint8Array;
  contentType: string;
  /** KMS CMK ARN — Standard tier CMK or per-HIPAA-tenant CMK. */
  kmsKeyId: string;
}

export async function putExport(input: PutExportInput): Promise<void> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: input.bucket,
      Key: input.key,
      Body: input.bytes,
      ContentType: input.contentType,
      ServerSideEncryption: "aws:kms",
      SSEKMSKeyId: input.kmsKeyId,
    }),
  );
}

export async function presignedGet(
  bucket: string,
  key: string,
  expiresInSeconds = 300, // ≤ 5 minutes per DESIGN §12
): Promise<string> {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(getClient(), cmd, { expiresIn: expiresInSeconds });
}
