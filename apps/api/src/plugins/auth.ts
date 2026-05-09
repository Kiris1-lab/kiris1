import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

/**
 * Auth middleware. Verifies the Cognito JWT, hydrates `req.auth` with tenant
 * + tier + role + hipaaSession, and rejects if missing.
 *
 * Step 3: stub verifier that accepts a dev token format ("dev:<userId>") for
 * local development and lookups in the DB. Real Cognito JWT verification (via
 * jose + JWKS) lands when Cognito is provisioned.
 *
 * Hard rule (DESIGN §6.1): the tier flag in the JWT is verified server-side
 * EVERY request — the client cannot upgrade itself.
 */
const authPlugin: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", async (req, reply) => {
    // Public endpoints (Stripe webhook, health) opt out via route config.
    const routeConfig = (req.routeOptions?.config ?? {}) as { public?: boolean };
    if (routeConfig.public) return;

    const header = req.headers.authorization;
    if (!header || !header.toLowerCase().startsWith("bearer ")) {
      reply.code(401).send({ error: "missing_authorization" });
      return reply;
    }

    const token = header.slice(7).trim();

    // Dev token: "dev:<userId>:<tenantId>:<tier>:<role>" — local development only.
    // In production this branch is dead code; Cognito JWT verification is the
    // sole code path.
    if (process.env.NODE_ENV !== "production" && token.startsWith("dev:")) {
      const [, userId = "u_dev", tenantId = "t_dev", tier = "standard", role = "editor"] =
        token.split(":");
      req.auth = {
        userId,
        tenantId,
        tier: tier === "hipaa" ? "hipaa" : "standard",
        role: role as "org_admin" | "team_admin" | "editor" | "viewer",
        hipaaSession: tier === "hipaa",
      };
      return;
    }

    // Production: verify Cognito JWT.
    // Implementation lands when Cognito is provisioned (Phase 1, infra step).
    reply.code(401).send({ error: "invalid_token" });
    return reply;
  });
};

export default fp(authPlugin, { name: "auth" });
