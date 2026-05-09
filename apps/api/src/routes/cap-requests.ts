import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { withTenant, schema } from "@kiris/db";

/**
 * Per-seat cap workflow — DESIGN §10.5.
 * Soft-warn at 80%, hard-block at 100%, request → admin queue.
 */
const capRequestsRoute: FastifyPluginAsync = async (app) => {
  app.get("/v1/cap-requests", { config: { audit: false } }, async (req) => {
    return withTenant(
      { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
      async (db) => {
        const rows = await db
          .select()
          .from(schema.capRequests)
          .where(eq(schema.capRequests.tenantId, req.auth.tenantId));
        return { requests: rows };
      },
    );
  });

  const createSchema = z.object({
    kind: z.enum(["ai_credits", "narration_minutes"]),
    requestedAmount: z.number().int().positive().max(10_000),
    currentUsage: z.number().int().nonnegative(),
    reason: z.string().min(1).max(500),
  });

  app.post(
    "/v1/cap-requests",
    { config: { audit: { action: "cap_request.create" } } },
    async (req, reply) => {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }
      const created = await withTenant(
        { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
        async (db) => {
          const [row] = await db
            .insert(schema.capRequests)
            .values({
              tenantId: req.auth.tenantId,
              userId: req.auth.userId,
              kind: parsed.data.kind,
              requestedAmount: parsed.data.requestedAmount,
              currentUsage: parsed.data.currentUsage,
              reason: parsed.data.reason,
            })
            .returning();
          return row;
        },
      );
      return reply.code(201).send({ request: created });
    },
  );

  const decideSchema = z.object({
    decision: z.enum(["approved", "denied"]),
    setAsBaseline: z.boolean().default(false),
  });

  app.post<{ Params: { id: string } }>(
    "/v1/cap-requests/:id/decide",
    { config: { audit: { action: "cap_request.decide" } } },
    async (req, reply) => {
      // Only org_admins / team_admins can decide.
      if (req.auth.role !== "org_admin" && req.auth.role !== "team_admin") {
        return reply.code(403).send({ error: "forbidden" });
      }
      const parsed = decideSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
      }

      const updated = await withTenant(
        { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
        async (db) => {
          const [row] = await db
            .update(schema.capRequests)
            .set({
              status: parsed.data.decision,
              decidedBy: req.auth.userId,
              decidedAt: new Date(),
            })
            .where(
              and(
                eq(schema.capRequests.id, req.params.id),
                eq(schema.capRequests.tenantId, req.auth.tenantId),
              ),
            )
            .returning();
          return row;
        },
      );
      if (!updated) return reply.code(404).send({ error: "request_not_found" });
      return { request: updated };
    },
  );
};

export default capRequestsRoute;
