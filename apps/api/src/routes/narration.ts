import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { withTenant, schema } from "@kiris/db";
import { eq } from "drizzle-orm";
import { getMonthToDateUsage } from "@kiris/metering";
import { synthesize } from "../services/polly.js";

/**
 * Narration job creation. The actual synthesis runs inline for Step 3
 * simplicity; in Step 4 the route enqueues to SQS and a worker performs the
 * Polly call so the request returns quickly.
 *
 * Hard rules:
 *   - Generative engine carries a default per-tenant monthly cap. Misclicks
 *     on a "premium voice" toggle should not be able to rack up 8x charges
 *     without a hard ceiling.
 */
const GENERATIVE_DEFAULT_MONTHLY_MINUTES = 60;
const GENERATIVE_CHARS_PER_MINUTE = 900; // ~150 wpm * 6 char/word
const narrationRoute: FastifyPluginAsync = async (app) => {
  const bodySchema = z.object({
    moduleId: z.string().uuid(),
    slideId: z.string().uuid(),
    text: z.string().min(1).max(8000),
    voice: z.string().default("Joanna"),
    engine: z.enum(["neural", "generative"]).default("neural"),
  });

  app.post(
    "/v1/narration/generate",
    { config: { audit: { action: "narration.generate" } } },
    async (req, reply) => {
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }

      // Confirm slide belongs to tenant before synthesizing.
      await withTenant(
        { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
        async (db) => {
          const [slide] = await db
            .select()
            .from(schema.slides)
            .where(eq(schema.slides.id, parsed.data.slideId))
            .limit(1);
          if (!slide || slide.tenantId !== req.auth.tenantId) {
            throw Object.assign(new Error("slide_not_found"), { statusCode: 404 });
          }
        },
      );

      // Hard ceiling on Generative engine to bound the 8x cost surprise.
      if (parsed.data.engine === "generative") {
        const usage = await getMonthToDateUsage(
          req.auth.tenantId,
          req.auth.userId,
          req.auth.hipaaSession,
        );
        const usedChars = usage["narration_generative_char"] ?? 0;
        const ceilingChars = GENERATIVE_DEFAULT_MONTHLY_MINUTES * GENERATIVE_CHARS_PER_MINUTE;
        if (usedChars + parsed.data.text.length > ceilingChars) {
          return reply.code(402).send({
            error: "generative_narration_cap_exceeded",
            usedChars,
            ceilingChars,
            message:
              "Generative narration would exceed this tenant's monthly cap. " +
              "Switch to neural or contact ops to lift the cap.",
          });
        }
      }

      const result = await synthesize({
        text: parsed.data.text,
        voice: parsed.data.voice,
        engine: parsed.data.engine,
      });

      try {
        await withTenant(
          { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
          async (db) => {
            await db.insert(schema.narrationJobs).values({
              tenantId: req.auth.tenantId,
              moduleId: parsed.data.moduleId,
              slideId: parsed.data.slideId,
              voice: parsed.data.voice,
              engine: parsed.data.engine,
              charCount: result.charCount,
              status: "completed",
              pollyRequestId: result.pollyRequestId,
            });
          },
        );
      } catch (err) {
        req.log.error({ err }, "narration_jobs audit write failed");
      }

      reply.header("Content-Type", result.contentType);
      reply.header("X-Polly-Request-Id", result.pollyRequestId ?? "");
      return reply.send(Buffer.from(result.audio));
    },
  );
};

export default narrationRoute;
