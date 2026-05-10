import "./types.js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import * as Sentry from "@sentry/node";
import { initSentry } from "@kiris/observability";
import { loadEnv } from "./env.js";
import requestIdPlugin from "./plugins/request-id.js";
import csrfPlugin from "./plugins/csrf.js";
import authPlugin from "./plugins/auth.js";
import auditPlugin from "./plugins/audit.js";
import healthRoute from "./routes/health.js";
import modulesRoute from "./routes/modules.js";
import scrubberRoute from "./routes/scrubber.js";
import generateRoute from "./routes/generate.js";
import narrationRoute from "./routes/narration.js";
import capRequestsRoute from "./routes/cap-requests.js";
import exportsRoute from "./routes/exports.js";
import hipaaUpgradeRoute from "./routes/hipaa-upgrade.js";
import stripeWebhookRoute from "./routes/stripe-webhook.js";
import internalScheduledRoute from "./routes/internal-scheduled.js";

/**
 * Kiris API server. Fastify, ESM, single-process.
 *
 * Plugin order matters:
 *   1. request-id  — every log line carries x-request-id
 *   2. cors / helmet
 *   3. auth        — populates req.auth (or rejects)
 *   4. rate-limit  — keyed by req.auth.userId; auth must run first
 *   5. csrf        — bearer-path skip relies on auth having validated the bearer
 *   6. audit       — writes after auth (so it has actor info)
 *   7. routes
 *
 * Note on the Stripe webhook: it is registered with `{ config: { public: true } }`
 * and uses signature verification. Its raw-body content-type parser is
 * encapsulated to that route's plugin scope (see routes/stripe-webhook.ts) so
 * other JSON routes still receive parsed objects.
 */
async function build() {
  const env = loadEnv();

  initSentry({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    release: env.GIT_SHA,
    init: Sentry.init as unknown as (opts: Record<string, unknown>) => void,
  });

  const app = Fastify({
    logger: { level: env.LOG_LEVEL },
    bodyLimit: 5 * 1024 * 1024,
    disableRequestLogging: false,
    trustProxy: true,
  });

  await app.register(requestIdPlugin);
  await app.register(cors, {
    origin: env.CORS_ORIGINS.split(",").map((s) => s.trim()),
    credentials: true,
  });
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(authPlugin);
  await app.register(rateLimit, {
    max: 600,
    timeWindow: "1 minute",
    keyGenerator: (req) => req.auth?.userId ?? req.ip,
  });
  await app.register(csrfPlugin);
  await app.register(auditPlugin);

  await app.register(healthRoute);
  await app.register(stripeWebhookRoute);
  await app.register(modulesRoute);
  await app.register(scrubberRoute);
  await app.register(generateRoute);
  await app.register(narrationRoute);
  await app.register(capRequestsRoute);
  await app.register(exportsRoute);
  await app.register(hipaaUpgradeRoute);
  await app.register(internalScheduledRoute);

  return app;
}

async function main() {
  const env = loadEnv();
  const app = await build();
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info({ port: env.PORT }, "kiris api listening");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith("server.ts")) {
  main();
}

export { build };
