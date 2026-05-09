import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { eq, and, isNull, desc } from "drizzle-orm";
import { withTenant, schema } from "@kiris/db";

/**
 * Module CRUD. Every read goes through `withTenant` so RLS sees the tenant
 * context. RLS would block a misrouted query anyway, but we never want to
 * rely on that as the only barrier.
 */
const modulesRoute: FastifyPluginAsync = async (app) => {
  app.get("/v1/modules", { config: { audit: false } }, async (req) => {
    return withTenant(
      { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
      async (db) => {
        const rows = await db
          .select({
            id: schema.modules.id,
            title: schema.modules.title,
            status: schema.modules.status,
            authoringMode: schema.modules.authoringMode,
            updatedAt: schema.modules.updatedAt,
            estimatedDurationSeconds: schema.modules.estimatedDurationSeconds,
          })
          .from(schema.modules)
          .where(
            and(
              eq(schema.modules.tenantId, req.auth.tenantId),
              isNull(schema.modules.deletedAt),
            ),
          )
          .orderBy(desc(schema.modules.updatedAt))
          .limit(100);
        return { modules: rows };
      },
    );
  });

  app.get<{ Params: { id: string } }>(
    "/v1/modules/:id",
    { config: { audit: false } },
    async (req, reply) => {
      const result = await withTenant(
        { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
        async (db) => {
          const [mod] = await db
            .select()
            .from(schema.modules)
            .where(
              and(
                eq(schema.modules.id, req.params.id),
                eq(schema.modules.tenantId, req.auth.tenantId),
                isNull(schema.modules.deletedAt),
              ),
            )
            .limit(1);
          if (!mod) return null;
          const slides = await db
            .select()
            .from(schema.slides)
            .where(eq(schema.slides.moduleId, mod.id))
            .orderBy(schema.slides.position);
          return { module: mod, slides };
        },
      );
      if (!result) return reply.code(404).send({ error: "module_not_found" });
      return result;
    },
  );

  const createSchema = z.object({
    title: z.string().min(1).max(200),
    audience: z.string().max(2000).optional(),
    authoringMode: z.enum(["express", "guided"]),
  });

  app.post(
    "/v1/modules",
    { config: { audit: { action: "module.create" } } },
    async (req, reply) => {
      const body = createSchema.safeParse(req.body);
      if (!body.success) {
        return reply.code(400).send({ error: "invalid_body", issues: body.error.issues });
      }
      const created = await withTenant(
        { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
        async (db) => {
          const [row] = await db
            .insert(schema.modules)
            .values({
              tenantId: req.auth.tenantId,
              title: body.data.title,
              authoringMode: body.data.authoringMode,
              createdBy: req.auth.userId,
              learningObjectives: [],
              estimatedDurationSeconds: 0,
            })
            .returning();
          return row;
        },
      );
      return reply.code(201).send({ module: created });
    },
  );

  const patchSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    status: z.enum(["draft", "ready", "exported"]).optional(),
    learningObjectives: z
      .array(z.object({ id: z.string(), text: z.string(), bloom: z.string() }))
      .optional(),
    estimatedDurationSeconds: z.number().int().nonnegative().optional(),
  });

  app.patch<{ Params: { id: string } }>(
    "/v1/modules/:id",
    { config: { audit: { action: "module.update" } } },
    async (req, reply) => {
      const body = patchSchema.safeParse(req.body);
      if (!body.success) {
        return reply.code(400).send({ error: "invalid_body", issues: body.error.issues });
      }
      const updated = await withTenant(
        { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
        async (db) => {
          const [row] = await db
            .update(schema.modules)
            .set({ ...body.data, updatedAt: new Date() })
            .where(
              and(
                eq(schema.modules.id, req.params.id),
                eq(schema.modules.tenantId, req.auth.tenantId),
              ),
            )
            .returning();
          return row;
        },
      );
      if (!updated) return reply.code(404).send({ error: "module_not_found" });
      return { module: updated };
    },
  );
};

export default modulesRoute;
