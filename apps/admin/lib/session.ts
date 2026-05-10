import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getAdminConfig, SESSION_COOKIE_NAME } from "./admin-config";

/**
 * Admin SSO session.
 *
 * Production: Google Workspace OAuth + hardware-key MFA (DESIGN §9, §15.1).
 * Identity is asserted by an HMAC-signed JWT cookie issued by
 * /api/auth/callback after a successful OAuth + MFA flow.
 *
 * Hard rules from DESIGN §15.1:
 *   - No password fallback. Ever.
 *   - Hardware key MFA mandatory (gated by ADMIN_ALLOW_NO_MFA=false in prod).
 *   - Read-only by default; write actions require role + justification.
 *
 * Local dev: set ADMIN_DEV_SESSION_ONLY=true to skip OAuth and use the demo
 * session. Refused in production by getAdminConfig().
 */

export type InternalRole = "viewer" | "support" | "billing_admin" | "ops_admin" | "super_admin";

export interface InternalSession {
  id: string;
  email: string;
  name: string;
  role: InternalRole;
  hardwareKeyVerifiedAt: string;
}

interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: InternalRole;
  mfa_at: string;
}

const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

const DEMO_SESSION: InternalSession = {
  id: "iu_demo",
  email: "ops@kiris.ai",
  name: "Sam Rivera",
  role: "ops_admin",
  hardwareKeyVerifiedAt: new Date().toISOString(),
};

export async function getInternalSession(): Promise<InternalSession | null> {
  const cfg = getAdminConfig();
  if (cfg.devSessionOnly) return DEMO_SESSION;
  if (!cfg.sessionSigningKey) return null;

  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const { payload } = await jwtVerify<SessionPayload>(raw, cfg.sessionSigningKey, {
      algorithms: ["HS256"],
      issuer: "kiris.admin",
      audience: "kiris.admin",
    });
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      hardwareKeyVerifiedAt: payload.mfa_at,
    };
  } catch {
    return null;
  }
}

/** Server-side only — call from page handlers / route handlers. */
export async function requireInternalSession(): Promise<InternalSession> {
  const session = await getInternalSession();
  if (!session) {
    throw new Error("admin_session_required");
  }
  return session;
}

export async function issueSessionCookie(payload: {
  id: string;
  email: string;
  name: string;
  role: InternalRole;
  mfaVerifiedAt: Date;
}): Promise<string> {
  const cfg = getAdminConfig();
  if (!cfg.sessionSigningKey) {
    throw new Error("ADMIN_SESSION_SIGNING_KEY not configured");
  }
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
    mfa_at: payload.mfaVerifiedAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("kiris.admin")
    .setAudience("kiris.admin")
    .setSubject(payload.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(cfg.sessionSigningKey);
}

/**
 * Authorization helper. Throws if the role is below the requirement.
 */
export function requireRole(required: InternalRole, current: InternalRole): void {
  const order: InternalRole[] = ["viewer", "support", "billing_admin", "ops_admin", "super_admin"];
  if (order.indexOf(current) < order.indexOf(required)) {
    throw new Error(`role_required: ${required}`);
  }
}
