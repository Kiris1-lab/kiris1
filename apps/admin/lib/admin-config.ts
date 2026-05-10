/**
 * Admin app configuration. Centralized so missing values fail fast at boot
 * rather than at the first request.
 *
 * Hard rules (DESIGN §15.1):
 *   - Production REQUIRES Google Workspace OAuth + hardware-key MFA.
 *   - No password fallback.
 *   - Allowed emails MUST be a static allowlist sourced from env, not the DB.
 */

interface AdminConfig {
  googleClientId: string | null;
  googleClientSecret: string | null;
  googleHostedDomain: string;
  sessionSigningKey: Uint8Array | null;
  allowedEmails: Set<string>;
  baseUrl: string;
  /** Bypass MFA for local dev only. Refused in production by guard below. */
  allowNoMfa: boolean;
  /** When true, skip OAuth and use the demo session. Local dev only. */
  devSessionOnly: boolean;
  /** Hardware-key WebAuthn rpID. Defaults to admin baseUrl host. */
  webauthnRpId: string | null;
}

let _cached: AdminConfig | undefined;

export function getAdminConfig(): AdminConfig {
  if (_cached) return _cached;

  const isProd = process.env.NODE_ENV === "production";
  // Next.js sets NEXT_PHASE to "phase-production-build" during `next build`.
  // Production env enforcement happens at runtime, not at build time, so a
  // build with default env still produces a valid bundle.
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  const allowNoMfa = process.env.ADMIN_ALLOW_NO_MFA === "true";
  const devSessionOnly = process.env.ADMIN_DEV_SESSION_ONLY === "true";

  if (isProd && !isBuildPhase && allowNoMfa) {
    throw new Error("ADMIN_ALLOW_NO_MFA=true is forbidden when NODE_ENV=production");
  }
  if (isProd && !isBuildPhase && devSessionOnly) {
    throw new Error("ADMIN_DEV_SESSION_ONLY=true is forbidden when NODE_ENV=production");
  }

  const signingKeyRaw = process.env.ADMIN_SESSION_SIGNING_KEY;
  if (isProd && !isBuildPhase && (!signingKeyRaw || signingKeyRaw.length < 32)) {
    throw new Error("ADMIN_SESSION_SIGNING_KEY must be set and ≥32 bytes when NODE_ENV=production");
  }

  const sessionSigningKey = signingKeyRaw ? new TextEncoder().encode(signingKeyRaw) : null;

  const allowedEmails = new Set(
    (process.env.ADMIN_ALLOWED_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  if (isProd && !isBuildPhase && allowedEmails.size === 0) {
    throw new Error("ADMIN_ALLOWED_EMAILS must be a non-empty comma-separated list in production");
  }

  _cached = {
    googleClientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? null,
    googleClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? null,
    googleHostedDomain: process.env.GOOGLE_HOSTED_DOMAIN ?? "kiris.ai",
    sessionSigningKey,
    allowedEmails,
    baseUrl: process.env.ADMIN_BASE_URL ?? "http://localhost:3001",
    allowNoMfa,
    devSessionOnly,
    webauthnRpId: process.env.ADMIN_WEBAUTHN_RP_ID ?? null,
  };

  if (isProd && !isBuildPhase && (!_cached.googleClientId || !_cached.googleClientSecret)) {
    throw new Error(
      "GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET must be set in production",
    );
  }

  return _cached;
}

export const SESSION_COOKIE_NAME = "kiris.admin.session";
