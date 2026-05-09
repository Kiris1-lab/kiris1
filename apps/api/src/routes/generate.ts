import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import {
  buildExpressPrompt,
  buildSlideHelperPrompt,
  validateModule,
} from "@kiris/learning-engine";
import { scrubText } from "@kiris/scrubber";
import { withTenant, schema } from "@kiris/db";
import { generate } from "../services/anthropic.js";

/**
 * AI generation endpoints — DESIGN §10, §17.
 *
 * Hard rules:
 *   - Standard tier inputs run through the scrubber pre-flight.
 *   - Anthropic call is routed by tier (two-key router in services/anthropic.ts).
 *   - Logged in `ai_generations` with request_id only — never the prompt or
 *     response body.
 */
const generateRoute: FastifyPluginAsync = async (app) => {
  const expressSchema = z.object({
    title: z.string().min(1).max(200),
    audience: z.string().min(1).max(2000),
    goal: z.string().max(2000).default(""),
    targetDurationSeconds: z.number().int().positive().nullable().default(null),
    materialsText: z.string().max(50000).optional(),
    moduleId: z.string().uuid().optional(),
  });

  app.post(
    "/v1/generate/express",
    {
      config: {
        audit: { action: "generate.express" },
        // Tighter than the global 600/min — Anthropic calls are expensive.
        rateLimit: { max: 30, timeWindow: "1 minute" },
      },
    },
    async (req, reply) => {
      const parsed = expressSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }

      // Pre-flight scrub on Standard tier.
      if (req.auth.tier === "standard") {
        const probe = [parsed.data.title, parsed.data.audience, parsed.data.goal, parsed.data.materialsText ?? ""].join("\n\n");
        const scrub = await scrubText(probe);
        if (scrub.decision === "block") {
          return reply.code(422).send({
            error: "phi_detected",
            decision: "block",
            detectedEntityTypes: scrub.detectedEntityTypes,
            upgradeUrl: "/upgrade/hipaa",
          });
        }
      }

      const prompt = buildExpressPrompt({
        title: parsed.data.title,
        audience: parsed.data.audience,
        goal: parsed.data.goal,
        targetDurationSec: parsed.data.targetDurationSeconds,
        materialsText: parsed.data.materialsText,
      });

      const out = await generate({
        tier: req.auth.tier,
        system: prompt.system,
        user: prompt.user,
        maxTokens: 8192,
      });

      // Parse the JSON envelope. The model is instructed to return raw JSON.
      const moduleJson = safeJsonParse(out.text);
      const findings = moduleJson ? validateModule(moduleJson) : [];

      try {
        await withTenant(
          { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
          async (db) => {
            await db.insert(schema.aiGenerations).values({
              tenantId: req.auth.tenantId,
              moduleId: parsed.data.moduleId ?? null,
              model: out.model,
              kind: "express",
              apiKeyPool: out.pool,
              inputTokens: out.inputTokens,
              outputTokens: out.outputTokens,
              requestId: out.requestId ?? "unknown",
            });
          },
        );
      } catch (err) {
        req.log.error({ err }, "ai_generations audit write failed");
      }

      return {
        module: moduleJson,
        validation: findings,
        usage: { inputTokens: out.inputTokens, outputTokens: out.outputTokens },
        requestId: out.requestId,
      };
    },
  );

  const helperSchema = z.object({
    audience: z.string(),
    helper: z.enum([
      "polish",
      "improve_clarity",
      "shorten",
      "mayer_audit",
      "translate_plain",
      "regenerate",
    ]),
    field: z.enum(["title", "bodyMarkdown", "narrationScript", "altText"]),
    fieldValue: z.string().max(20000),
    slideTitle: z.string().max(200),
    slideType: z.string().max(64),
    moduleId: z.string().uuid().optional(),
  });

  app.post(
    "/v1/generate/slide-helper",
    {
      config: {
        audit: { action: "generate.slide_helper" },
        rateLimit: { max: 120, timeWindow: "1 minute" },
      },
    },
    async (req, reply) => {
      const parsed = helperSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }

      if (req.auth.tier === "standard") {
        const scrub = await scrubText(parsed.data.fieldValue);
        if (scrub.decision === "block") {
          return reply.code(422).send({
            error: "phi_detected",
            decision: "block",
            detectedEntityTypes: scrub.detectedEntityTypes,
          });
        }
      }

      const prompt = buildSlideHelperPrompt(parsed.data);
      const out = await generate({
        tier: req.auth.tier,
        system: prompt.system,
        user: prompt.user,
        maxTokens: 2048,
      });

      try {
        await withTenant(
          { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
          async (db) => {
            await db.insert(schema.aiGenerations).values({
              tenantId: req.auth.tenantId,
              moduleId: parsed.data.moduleId ?? null,
              model: out.model,
              kind: `helper.${parsed.data.helper}`,
              apiKeyPool: out.pool,
              inputTokens: out.inputTokens,
              outputTokens: out.outputTokens,
              requestId: out.requestId ?? "unknown",
            });
          },
        );
      } catch (err) {
        req.log.error({ err }, "ai_generations audit write failed");
      }

      return {
        result: out.text,
        usage: { inputTokens: out.inputTokens, outputTokens: out.outputTokens },
        requestId: out.requestId,
      };
    },
  );
};

function safeJsonParse(s: string): any {
  try {
    return JSON.parse(s);
  } catch {
    // Try to extract a fenced JSON block.
    const m = s.match(/```json\s*([\s\S]*?)\s*```/);
    if (m && m[1]) {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export default generateRoute;
