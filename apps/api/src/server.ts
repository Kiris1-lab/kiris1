import "./types.js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { loadEnv } from "./env.js";
import requestIdPlugin from "./plugins/request-id.js";
import authPlugin from "./plugins/auth.js";
import auditPlugin from "./plugins/audit.js";
import healthRoute from "./routes/health.js";
import modulesRoute from "./routes/modules.js";
import scrubberRoute from "./routes/scrubber.js";
import generateRoute from "./routes/generate.js";
import narrationRoute from "./routes/narration.js";
import capRequestsRoute from "./routes/cap-requests.js";
import exportsRoute from "./routes/exports.js";
import stripeWebhookRoute from "./routes/stripe-webhook.js";

/**
 * Kiris API server. Fastify, ESM, single-process.
 *
 * Plugin order matters:
 *   1. request-id  — every log line carries x-request-id
 *   2. cors / helmet / rate limit
 *   3. auth        — populates req.auth (or rejects)
 *   4. audit       — writes after auth (so it has actor info)
 *   5. routes
 */
async function build() {
  const env = loadEnv();
  const app = Fastify({
    logger: { level: env.LOG_LEVEL },
    bodyLimit: 5 * 1024 * 1024, // 5 MB; uploads use signed S3 URLs, not the API
    disableRequestLogging: false,
    trustProxy: true,
  });

  await app.register(requestIdPlugin);
  await app.register(cors, {
    origin: env.CORS_ORIGINS.split(",").map((s) => s.trim()),
    credentials: true,
  });
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(rateLimit, {
    max: 600,
    timeWindow: "1 minute",
    keyGenerator: (req) => {
      // Per user when authenticated, per IP otherwise.
      return req.auth?.userId ?? req.ip;
    },
  });
  await app.register(authPlugin);
  await app.register(auditPlugin);

  await app.register(healthRoute);
  await app.register(stripeWebhookRoute);
  await app.register(modulesRoute);
  await app.register(scrubberRoute);
  await app.register(generateRoute);
  await app.register(narrationRoute);
  await app.register(capRequestsRoute);
  await app.register(exportsRoute);

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
