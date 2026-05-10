import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";
import { getAdminConfig, SESSION_COOKIE_NAME } from "@/lib/admin-config";
import { issueSessionCookie, type InternalRole } from "@/lib/session";

export const runtime = "nodejs";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUER = ["https://accounts.google.com", "accounts.google.com"];

interface GoogleIdTokenClaims extends JWTPayload {
  email?: string;
  email_verified?: boolean;
  name?: string;
  hd?: string;
}

let _jwks: ReturnType<typeof createRemoteJWKSet> | undefined;
function googleJwks() {
  if (_jwks) return _jwks;
  _jwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL), {
    cooldownDuration: 30_000,
    cacheMaxAge: 10 * 60_000,
  });
  return _jwks;
}

/**
 * Google OAuth callback. Verifies the ID token, checks the workspace domain
 * and the static allowlist, refuses to issue a session if hardware-key MFA
 * is unverified (unless ADMIN_ALLOW_NO_MFA=true in non-prod).
 */
export async function GET(req: NextRequest) {
  const cfg = getAdminConfig();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = req.cookies.get("kiris.admin.oauth_state")?.value;

  const errorRedirect = (err: string) =>
    NextResponse.redirect(`${cfg.baseUrl}/sign-in?error=${err}`);

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return errorRedirect("state_mismatch");
  }
  if (!cfg.googleClientId || !cfg.googleClientSecret) {
    return errorRedirect("oauth_failed");
  }

  // Exchange the authorization code for an ID token.
  let idToken: string;
  try {
    const body = new URLSearchParams({
      code,
      client_id: cfg.googleClientId,
      client_secret: cfg.googleClientSecret,
      redirect_uri: `${cfg.baseUrl}/api/auth/callback`,
      grant_type: "authorization_code",
    });
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!tokenRes.ok) return errorRedirect("oauth_failed");
    const json = (await tokenRes.json()) as { id_token?: string };
    if (!json.id_token) return errorRedirect("oauth_failed");
    idToken = json.id_token;
  } catch {
    return errorRedirect("oauth_failed");
  }

  // Verify the ID token (signature, issuer, audience).
  let claims: GoogleIdTokenClaims;
  try {
    const { payload } = await jwtVerify<GoogleIdTokenClaims>(idToken, googleJwks(), {
      issuer: GOOGLE_ISSUER,
      audience: cfg.googleClientId,
    });
    claims = payload;
  } catch {
    return errorRedirect("oauth_failed");
  }

  if (!claims.email_verified || !claims.email) return errorRedirect("oauth_failed");
  if (claims.hd !== cfg.googleHostedDomain) return errorRedirect("domain");

  const email = claims.email.toLowerCase();
  if (!cfg.allowedEmails.has(email)) return errorRedirect("not_allowlisted");

  // Hardware-key MFA: real impl ties to WebAuthn. For now we accept the
  // OAuth assertion as MFA only when ADMIN_ALLOW_NO_MFA is true (refused in
  // production by getAdminConfig). Otherwise, redirect to the WebAuthn
  // challenge flow (placeholder; lands when WebAuthn is provisioned).
  if (!cfg.allowNoMfa) {
    return errorRedirect("mfa_required");
  }

  // Look up internal user role. For now, default to ops_admin for any
  // allowlisted account; real impl reads from internal_users table.
  const role: InternalRole = "ops_admin";

  const sub = claims.sub ?? email;
  const name = claims.name ?? email.split("@")[0] ?? email;
  const cookieValue = await issueSessionCookie({
    id: sub,
    email,
    name,
    role,
    mfaVerifiedAt: new Date(),
  });

  const next = url.searchParams.get("next");
  const safeNext =
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const res = NextResponse.redirect(`${cfg.baseUrl}${safeNext}`);
  res.cookies.set(SESSION_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  res.cookies.delete("kiris.admin.oauth_state");
  return res;
}
