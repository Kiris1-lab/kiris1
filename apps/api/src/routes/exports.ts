import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { withTenant, schema } from "@kiris/db";
import { packageScorm12, type ScormSlide } from "@kiris/scorm";

/**
 * Module export — SCORM 1.2 only in Step 4 (DESIGN §11 priority).
 *
 * Step 4 returns the ZIP inline. In Step 5 the ZIP is uploaded to
 * S3-with-KMS and we return a signed URL with ≤ 5 min expiry (DESIGN §12).
 *
 * Hard rules:
 *   - withTenant gates the read; RLS ensures cross-tenant safety.
 *   - The audit middleware records the export action; we additionally write
 *     an `exports` row inline so the admin console can see the catalog.
 */
const exportsRoute: FastifyPluginAsync = async (app) => {
  const bodySchema = z.object({
    format: z.enum(["scorm12"]).default("scorm12"),
  });

  app.post<{ Params: { id: string } }>(
    "/v1/modules/:id/export",
    { config: { audit: { action: "module.export" } } },
    async (req, reply) => {
      const parsed = bodySchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }

      const ctx = { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession };

      const result = await withTenant(ctx, async (db) => {
        const [mod] = await db
          .select()
          .from(schema.modules)
          .where(
            and(
              eq(schema.modules.id, req.params.id),
              eq(schema.modules.tenantId, req.auth.tenantId),
            ),
          )
          .limit(1);
        if (!mod) return null;
        const slides = await db
          .select()
          .from(schema.slides)
          .where(eq(schema.slides.moduleId, mod.id))
          .orderBy(schema.slides.position);
        return { mod, slides };
      });

      if (!result) return reply.code(404).send({ error: "module_not_found" });

      const scormSlides: ScormSlide[] = result.slides.map((s) => ({
        id: s.id,
        position: s.position,
        type: s.type,
        title: s.title,
        bodyMarkdown: s.onScreenText,
        narrationScript: s.narrationScript,
        altText: s.altText,
        durationSeconds: s.durationSeconds,
      }));

      const zip = packageScorm12({
        id: result.mod.id,
        title: result.mod.title,
        authoringMode: result.mod.authoringMode,
        estimatedDurationSeconds: result.mod.estimatedDurationSeconds,
        learningObjectives: (result.mod.learningObjectives ?? []).map((o) => o.text),
        audience: "",
        slides: scormSlides,
        tier: req.auth.tier,
      });

      // Record the export. In Step 5 the s3Key is a real S3 location.
      try {
        await withTenant(ctx, async (db) => {
          await db.insert(schema.exports_).values({
            tenantId: req.auth.tenantId,
            moduleId: result.mod.id,
            format: "scorm12",
            s3Key: `inline://${result.mod.id}.zip`,
            bytes: zip.byteLength,
            createdBy: req.auth.userId,
          });
        });
      } catch (err) {
        req.log.error({ err }, "exports row write failed");
      }

      reply.header("Content-Type", "application/zip");
      reply.header(
        "Content-Disposition",
        `attachment; filename="${safeName(result.mod.title)}-scorm12.zip"`,
      );
      return reply.send(Buffer.from(zip));
    },
  );
};

function safeName(s: string): string {
  return s.replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 80) || "kiris-module";
}

export default exportsRoute;
