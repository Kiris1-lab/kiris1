import type { FastifyPluginAsync } from "fastify";
import { eq, and, isNull, isNotNull } from "drizzle-orm";
import { getDb, schema } from "@kiris/db";
import { aggregateUsageForDay } from "@kiris/metering";
import { allocateTenantCmk } from "../services/kms-allocator.js";
import { loadEnv } from "../env.js";

/**
 * Internal scheduled-job endpoints. Wired up as EventBridge rule targets in
 * infra (see infra/modules/eventbridge). The endpoints are PUBLIC at the
 * Fastify auth layer (no Cognito JWT) but require a static bearer matching
 * `INTERNAL_SIGNING_KEY`. EventBridge → API Gateway / ALB carries the bearer
 * via a connection's auth header; never set this key in tenant-facing code.
 *
 * Endpoints:
 *   POST /internal/scheduled/metering-rollup
 *     - Aggregates yesterday's usage_events into usage_daily for every tenant.
 *
 *   POST /internal/scheduled/stripe-overage-report
 *     - Reports period-to-date overage to Stripe. Pure pass-through; the
 *       per-tenant subscriptionItem mapping lives in `tenants.metadata` once
 *       Step-4 billing wiring lands.
 *
 *   POST /internal/scheduled/cmk-reconciler
 *     - Retries CMK allocation for any HIPAA tenant with hipaa_kms_key_arn
 *       still NULL. Idempotent; safe to run on a 5-minute schedule.
 */
const internalScheduledRoute: FastifyPluginAsync = async (app) => {
  const env = loadEnv();
  if (!env.INTERNAL_SIGNING_KEY) {
    app.log.warn("INTERNAL_SIGNING_KEY not set — /internal/scheduled/* disabled");
    return;
  }
  const expected = env.INTERNAL_SIGNING_KEY;

  const requireInternalAuth = async (
    req: { headers: Record<string, string | string[] | undefined> },
    reply: { code: (n: number) => { send: (b: object) => unknown } },
  ): Promise<boolean> => {
    const header = req.headers.authorization;
    if (typeof header !== "string" || !header.toLowerCase().startsWith("bearer ")) {
      reply.code(401).send({ error: "missing_authorization" });
      return false;
    }
    const presented = header.slice(7).trim();
    // Constant-time equal — both keys are ASCII, exact length match.
    if (presented.length !== expected.length) {
      reply.code(401).send({ error: "invalid_token" });
      return false;
    }
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= presented.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    if (diff !== 0) {
      reply.code(401).send({ error: "invalid_token" });
      return false;
    }
    return true;
  };

  app.post(
    "/internal/scheduled/metering-rollup",
    { config: { public: true, audit: false, csrf: false } },
    async (req, reply) => {
      if (!(await requireInternalAuth(req, reply))) return;
      const db = getDb();
      const tenants = await db.select({ id: schema.tenants.id }).from(schema.tenants);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      let totalRows = 0;
      let failures = 0;
      for (const t of tenants) {
        try {
          const { rows } = await aggregateUsageForDay(t.id, false, yesterday);
          totalRows += rows;
        } catch (err) {
          failures += 1;
          req.log.error(
            { err: (err as Error).message, tenantId: t.id, day: yesterday },
            "metering rollup failed for tenant",
          );
        }
      }
      return reply.send({
        ok: true,
        day: yesterday,
        tenants: tenants.length,
        rows: totalRows,
        failures,
      });
    },
  );

  app.post(
    "/internal/scheduled/cmk-reconciler",
    { config: { public: true, audit: false, csrf: false } },
    async (req, reply) => {
      if (!(await requireInternalAuth(req, reply))) return;
      const db = getDb();
      const pending = await db
        .select({ id: schema.tenants.id })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.hipaaEnabled, true), isNull(schema.tenants.hipaaKmsKeyArn)));
      let allocated = 0;
      let failed = 0;
      for (const t of pending) {
        try {
          await allocateTenantCmk(t.id);
          allocated += 1;
        } catch (err) {
          failed += 1;
          req.log.error(
            { err: (err as Error).message, tenantId: t.id, kms_alloc_failed: true },
            "CMK reconciler failed for tenant",
          );
        }
      }
      return reply.send({ ok: true, pending: pending.length, allocated, failed });
    },
  );

  app.post(
    "/internal/scheduled/dunning-tick",
    { config: { public: true, audit: false, csrf: false } },
    async (req, reply) => {
      if (!(await requireInternalAuth(req, reply))) return;
      // Stub: real dunning tick reads `invoices` + `tenants.dunningState`,
      // calls computeDunningState() from @kiris/billing, and writes the
      // transition + customer notification. Lands when the per-tenant
      // notification channel is wired (Step 5).
      const db = getDb();
      const pastDue = await db
        .select({ id: schema.tenants.id })
        .from(schema.tenants)
        .where(
          and(
            eq(schema.tenants.status, "past_due"),
            isNotNull(schema.tenants.stripeSubscriptionId),
          ),
        );
      return reply.send({ ok: true, pastDueTenants: pastDue.length });
    },
  );
};

export default internalScheduledRoute;
