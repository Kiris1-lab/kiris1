import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { withTenant, schema } from "@kiris/db";
import { packageScorm12, type ScormSlide } from "@kiris/scorm";
import { loadEnv } from "../env.js";
import { putExport, presignedGet } from "../services/s3.js";

/**
 * Module export — SCORM 1.2 only (DESIGN §11 priority).
 *
 *   - When S3_EXPORTS_BUCKET + KMS_KEY_ID_STANDARD are set, the ZIP is
 *     uploaded under SSE-KMS and we return a ≤ 5-minute signed URL
 *     (DESIGN §12).
 *   - Otherwise (local dev / tests), the ZIP is returned inline.
 *
 * Hard rules:
 *   - withTenant gates the read; RLS ensures cross-tenant safety.
 *   - The audit middleware records the export action; we additionally write
 *     an `exports` row inline so the admin console can see the catalog.
 *   - HIPAA tenants get the per-tenant CMK (KMS_KEY_ID_HIPAA placeholder
 *     today; per-tenant CMK ARNs come from `tenants.hipaa_kms_key_arn`
 *     once allocation lands in Phase 2 alongside the upgrade flow).
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

      const env = loadEnv();
      const filename = `${safeName(result.mod.title)}-scorm12.zip`;
      const bucket = env.S3_EXPORTS_BUCKET;
      const kms = req.auth.tier === "hipaa" ? env.KMS_KEY_ID_HIPAA : env.KMS_KEY_ID_STANDARD;

      let s3Key = `inline://${result.mod.id}.zip`;
      let signedUrl: string | undefined;

      if (bucket && kms) {
        s3Key = `tenants/${req.auth.tenantId}/exports/${result.mod.id}/${Date.now()}.zip`;
        await putExport({
          bucket,
          key: s3Key,
          bytes: zip,
          contentType: "application/zip",
          kmsKeyId: kms,
        });
        signedUrl = await presignedGet(bucket, s3Key, 300);
      }

      try {
        await withTenant(ctx, async (db) => {
          await db.insert(schema.exports_).values({
            tenantId: req.auth.tenantId,
            moduleId: result.mod.id,
            format: "scorm12",
            s3Key,
            bytes: zip.byteLength,
            createdBy: req.auth.userId,
            expiresAt: signedUrl ? new Date(Date.now() + 5 * 60 * 1000) : null,
          });
        });
      } catch (err) {
        req.log.error({ err }, "exports row write failed");
      }

      if (signedUrl) {
        return reply.code(200).send({
          format: "scorm12",
          filename,
          downloadUrl: signedUrl,
          expiresInSeconds: 300,
          bytes: zip.byteLength,
        });
      }

      reply.header("Content-Type", "application/zip");
      reply.header("Content-Disposition", `attachment; filename="${filename}"`);
      return reply.send(Buffer.from(zip));
    },
  );
};

function safeName(s: string): string {
  return s.replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 80) || "kiris-module";
}

export default exportsRoute;
