import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { withTenant, schema } from "@kiris/db";

const STATE_CHANGING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Audit-log every state-changing endpoint — DESIGN §6.6.
 *
 * Hard rules:
 *   - No PHI in log entries — references only.
 *   - Always include actor, IP, request_id, success.
 *   - tier_at_time captured per row so the audit table can be partitioned by
 *     retention policy (1 yr Standard / 6 yr HIPAA).
 */
const auditPlugin: FastifyPluginAsync = async (app) => {
  app.addHook("onResponse", async (req, reply) => {
    if (!STATE_CHANGING.has(req.method)) return;
    const cfg = (req.routeOptions?.config ?? {}) as { audit?: boolean | { action?: string } };
    if (cfg.audit === false) return;
    if (!req.auth) return; // public route; auth missing → not auditable

    const action =
      typeof cfg.audit === "object" && cfg.audit?.action
        ? cfg.audit.action
        : `${req.method} ${req.routeOptions?.url ?? req.url}`;

    try {
      await withTenant(
        { tenantId: req.auth.tenantId, hipaaSession: req.auth.hipaaSession },
        async (db) => {
          await db.insert(schema.auditLog).values({
            tenantId: req.auth.tenantId,
            actorUserId: req.auth.userId,
            action,
            targetType: "http_route",
            targetId: req.routeOptions?.url ?? req.url,
            ip: req.ip,
            userAgent:
              typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : null,
            requestId: req.requestId,
            success: reply.statusCode < 500,
            tierAtTime: req.auth.tier,
          });
        },
      );
    } catch (err) {
      // Audit-log writes must not break the request response. Surface to the
      // logger so ops can investigate.
      req.log.error({ err, audit_failed: true }, "audit log write failed");
    }
  });
};

export default fp(auditPlugin, { name: "audit", dependencies: ["auth"] });
