import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

/**
 * CSRF guard — DESIGN §12.
 *
 * The API is bearer-token-authenticated, so cross-origin browsers cannot
 * automatically attach an Authorization header. That blocks classic CSRF
 * for the JWT path. This guard adds defense-in-depth for any endpoint that
 * also accepts cookie-borne sessions (future Cognito hosted-UI exchange):
 *
 *   - Browsers requesting state-changing methods MUST present either
 *     `Authorization: bearer …` (the pure-bearer path) OR an
 *     `X-Kiris-CSRF: <token>` header that matches the `kiris.csrf` cookie.
 *   - Same-site fetch + fetch metadata is checked as a belt-and-braces.
 *
 * Stripe webhook is `config: { public: true }` and uses signature
 * verification instead — `csrf: false` opts it out.
 */

const STATE_CHANGING = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const ALLOWED_FETCH_SITES = new Set(["same-origin", "same-site", "none"]);

const csrfPlugin: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", async (req, reply) => {
    if (!STATE_CHANGING.has(req.method)) return;
    const cfg = (req.routeOptions?.config ?? {}) as { csrf?: boolean; public?: boolean };
    if (cfg.csrf === false || cfg.public === true) return;

    // Sec-Fetch sanity check applies to every browser request, regardless of
    // which credential carrier (bearer / cookie) is in use.
    const site = req.headers["sec-fetch-site"];
    if (typeof site === "string" && !ALLOWED_FETCH_SITES.has(site)) {
      reply.code(403).send({ error: "csrf_blocked" });
      return reply;
    }

    const cookies = parseCookie(req.headers.cookie ?? "");
    const sessionPresent = "kiris.session" in cookies || "kiris.csrf" in cookies;
    const authHeader = req.headers.authorization;
    const hasBearer =
      typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ");

    // Pure bearer with no Kiris session cookie → no CSRF risk.
    if (hasBearer && !sessionPresent) return;

    // Any Kiris session cookie in flight requires a matching CSRF token, even
    // alongside a bearer header. Bearer presence does NOT bypass the check —
    // an attacker controlling a cookie session shouldn't get a free pass by
    // also setting an unrelated bearer.
    const headerToken = req.headers["x-kiris-csrf"];
    const cookieToken = cookies["kiris.csrf"];
    if (
      typeof headerToken !== "string" ||
      !cookieToken ||
      !timingSafeEqualStr(headerToken, cookieToken)
    ) {
      reply.code(403).send({ error: "csrf_token_required" });
      return reply;
    }
  });
};

function parseCookie(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default fp(csrfPlugin, { name: "csrf", dependencies: ["request-id"] });
