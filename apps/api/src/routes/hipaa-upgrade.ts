import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { withTenant, schema } from "@kiris/db";

/**
 * HIPAA tier upgrade — DESIGN §2.2.
 *
 * Click-to-accept BAA by an `org_admin`. Logged with timestamp, IP, user,
 * BAA version hash. Sets `tenants.hipaa_enabled = true`, mints the
 * per-tenant CMK (alloc job kicked off here; CMK ARN populated by the
 * worker that runs `aws kms create-key`), pro-rates the upgrade charge.
 *
 * For now this endpoint flips the flag and records the BAA acceptance.
 * KMS CMK allocation + Stripe proration land alongside the API role IAM
 * grants in the deploy step.
 */

const BAA_VERSION = "v1.0";
const BAA_HASH = "sha256:placeholder-replace-with-real-baa-document-hash";

const acceptSchema = z.object({
  baaVersion: z.literal(BAA_VERSION),
  fullName: z.string().min(2).max(200),
  jobTitle: z.string().min(2).max(200),
  /** Browser-supplied; we also have req.ip server-side. */
  acceptedAt: z.string().datetime().optional(),
});

const hipaaUpgradeRoute: FastifyPluginAsync = async (app) => {
  app.post(
    "/v1/tenants/upgrade-hipaa",
    {
      config: {
        audit: { action: "tenant.hipaa_upgrade" },
        rateLimit: { max: 10, timeWindow: "1 minute" },
      },
    },
    async (req, reply) => {
      // Only org_admins can accept the BAA.
      if (req.auth.role !== "org_admin") {
        return reply.code(403).send({
          error: "forbidden",
          message: "Only an org_admin can accept the BAA on behalf of the tenant.",
        });
      }

      const parsed = acceptSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }

      const updated = await withTenant(
        { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
        async (db) => {
          const [row] = await db
            .update(schema.tenants)
            .set({
              hipaaEnabled: true,
              hipaaEnabledAt: new Date(),
              hipaaBaaVersion: BAA_VERSION,
              hipaaBaaAcceptedBy: req.auth.userId,
            })
            .where(eq(schema.tenants.id, req.auth.tenantId))
            .returning();
          return row;
        },
      );

      if (!updated) {
        return reply.code(404).send({ error: "tenant_not_found" });
      }

      // The audit middleware already records this request. We add a structured
      // log line so CloudWatch metric filters can count BAA acceptances.
      req.log.info(
        {
          action: "tenant.hipaa_upgrade",
          tenantId: req.auth.tenantId,
          baaVersion: BAA_VERSION,
          baaHash: BAA_HASH,
          accepterUserId: req.auth.userId,
          accepterFullName: parsed.data.fullName,
          accepterJobTitle: parsed.data.jobTitle,
        },
        "HIPAA upgrade accepted",
      );

      // TODO (Phase 2 deploy step): allocate per-tenant KMS CMK, Stripe
      // subscription proration to the HIPAA-tier price. Both run async via
      // worker queues so the request returns quickly.

      return {
        ok: true,
        tier: "hipaa",
        baaVersion: BAA_VERSION,
        upgradedAt: updated.hipaaEnabledAt,
      };
    },
  );
};

export default hipaaUpgradeRoute;
