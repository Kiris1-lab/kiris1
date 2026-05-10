import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { createRemoteJWKSet, jwtVerify, type JWTPayload, type JWTVerifyResult } from "jose";
import { loadEnv } from "../env.js";

/**
 * Auth middleware. Verifies the Cognito JWT, hydrates `req.auth` with tenant
 * + tier + role + hipaaSession, and rejects if missing.
 *
 * Hard rule (DESIGN §6.1): the tier flag in the JWT is verified server-side
 * EVERY request — the client cannot upgrade itself.
 *
 * Dev-token backdoor: gated behind ALLOW_DEV_TOKENS=true. The env validator
 * refuses to load with ALLOW_DEV_TOKENS=true when NODE_ENV=production, so a
 * missing NODE_ENV cannot silently re-enable it.
 */

interface KirisJwtClaims extends JWTPayload {
  sub?: string;
  "cognito:username"?: string;
  "custom:tenant_id"?: string;
  "custom:tier"?: "standard" | "hipaa";
  "custom:role"?: "org_admin" | "team_admin" | "editor" | "viewer";
  "custom:hipaa_session"?: "true" | "false";
  token_use?: "id" | "access";
  client_id?: string;
  aud?: string | string[];
}

const authPlugin: FastifyPluginAsync = async (app) => {
  const env = loadEnv();

  let verify: ((token: string) => Promise<JWTVerifyResult<KirisJwtClaims>>) | undefined;
  let issuer: string | undefined;

  if (env.COGNITO_USER_POOL_ID && env.COGNITO_REGION && env.COGNITO_CLIENT_ID) {
    issuer = `https://cognito-idp.${env.COGNITO_REGION}.amazonaws.com/${env.COGNITO_USER_POOL_ID}`;
    const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`), {
      cooldownDuration: 30_000,
      cacheMaxAge: 10 * 60_000,
    });
    verify = (token) =>
      jwtVerify<KirisJwtClaims>(token, jwks, {
        issuer,
        algorithms: ["RS256"],
      });
  }

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

    if (env.ALLOW_DEV_TOKENS && token.startsWith("dev:")) {
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

    if (!verify) {
      // Should be unreachable: env validator guarantees Cognito vars or
      // ALLOW_DEV_TOKENS=true. Fail closed if we get here anyway.
      reply.code(401).send({ error: "auth_unconfigured" });
      return reply;
    }

    let claims: KirisJwtClaims;
    try {
      const result = await verify(token);
      claims = result.payload;
    } catch (err) {
      req.log.warn({ err: (err as Error).message }, "jwt verification failed");
      reply.code(401).send({ error: "invalid_token" });
      return reply;
    }

    // Cognito access tokens carry client_id; ID tokens carry aud. Accept either
    // when it matches the configured app client.
    const audOk =
      claims.client_id === env.COGNITO_CLIENT_ID ||
      claims.aud === env.COGNITO_CLIENT_ID ||
      (Array.isArray(claims.aud) && claims.aud.includes(env.COGNITO_CLIENT_ID!));
    if (!audOk) {
      req.log.warn(
        { token_use: claims.token_use, client_id: claims.client_id },
        "jwt audience mismatch",
      );
      reply.code(401).send({ error: "invalid_audience" });
      return reply;
    }

    const userId = claims.sub ?? claims["cognito:username"];
    const tenantId = claims["custom:tenant_id"];
    if (!userId || !tenantId) {
      req.log.warn("jwt missing sub or custom:tenant_id");
      reply.code(401).send({ error: "invalid_claims" });
      return reply;
    }

    const tier = claims["custom:tier"] === "hipaa" ? "hipaa" : "standard";
    const role = claims["custom:role"] ?? "editor";
    const hipaaSession = tier === "hipaa" && claims["custom:hipaa_session"] === "true";

    req.auth = { userId, tenantId, tier, role, hipaaSession };
  });
};

export default fp(authPlugin, { name: "auth" });
