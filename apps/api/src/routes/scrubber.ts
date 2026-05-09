import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { scrubText } from "@kiris/scrubber";
import { withTenant, schema } from "@kiris/db";

/**
 * PHI scrubber endpoint. The app calls this before submitting any
 * user-content (Express materials, Guided slide bodies, etc.). The result
 * decides whether the UI proceeds, asks the user to confirm, or surfaces an
 * upgrade-to-HIPAA CTA.
 *
 * Hard rules:
 *   - Standard tier ALWAYS scrubs. HIPAA tier may skip server-side scrubbing
 *     since the data plane is HIPAA-scoped, but this endpoint runs the scrub
 *     anyway for symmetry.
 *   - The audit row stores `inputSha256` and entity types only — never the
 *     input value (DESIGN §6.6, §6.9).
 */
const scrubberRoute: FastifyPluginAsync = async (app) => {
  const bodySchema = z.object({
    text: z.string().max(20000),
    targetType: z.string().max(64),
    targetId: z.string().max(64).optional(),
  });

  app.post(
    "/v1/scrubber/text",
    { config: { audit: { action: "scrubber.text" } } },
    async (req, reply) => {
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }

      const result = await scrubText(parsed.data.text);

      try {
        await withTenant(
          { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
          async (db) => {
            await db.insert(schema.phiScrubberEvents).values({
              tenantId: req.auth.tenantId,
              userId: req.auth.userId,
              targetType: parsed.data.targetType,
              targetId: parsed.data.targetId ?? null,
              decision: result.decision,
              confidence: result.confidence,
              detectedEntityTypes: result.detectedEntityTypes,
            });
          },
        );
      } catch (err) {
        req.log.error({ err }, "scrubber audit write failed");
      }

      // Standard tier hard-block returns 422 with an upgrade CTA.
      if (req.auth.tier === "standard" && result.decision === "block") {
        return reply.code(422).send({
          error: "phi_detected",
          decision: "block",
          confidence: result.confidence,
          detectedEntityTypes: result.detectedEntityTypes,
          upgradeUrl: "/upgrade/hipaa",
          message:
            "We detected likely Protected Health Information. Upgrade to the HIPAA tier or remove the PHI before submitting.",
        });
      }

      return {
        decision: result.decision,
        confidence: result.confidence,
        detectedEntityTypes: result.detectedEntityTypes,
        inputSha256: result.inputSha256,
      };
    },
  );
};

export default scrubberRoute;
