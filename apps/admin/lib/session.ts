/**
 * Admin SSO session.
 *
 * Production: Google Workspace OAuth + hardware-key MFA (DESIGN §9, §15.1).
 * Step 4: shim that returns a hard-coded internal user so we can develop the
 * UI. The Google OAuth wiring lands when the production domain is ready.
 *
 * Hard rules from DESIGN §15.1:
 *   - No password fallback. Ever.
 *   - Hardware key MFA mandatory.
 *   - Read-only by default; write actions require role + justification.
 */

export type InternalRole =
  | "viewer"
  | "support"
  | "billing_admin"
  | "ops_admin"
  | "super_admin";

export interface InternalSession {
  id: string;
  email: string;
  name: string;
  role: InternalRole;
  hardwareKeyVerifiedAt: string;
}

export function getInternalSession(): InternalSession {
  return {
    id: "iu_demo",
    email: "ops@kiris.ai",
    name: "Sam Rivera",
    role: "ops_admin",
    hardwareKeyVerifiedAt: new Date().toISOString(),
  };
}

/**
 * Authorization helper. Throws if the role is below the requirement —
 * matches the API authorization (DESIGN §15.4). Use this in every
 * write-action handler.
 */
export function requireRole(
  required: InternalRole,
  current: InternalRole = getInternalSession().role,
): void {
  const order: InternalRole[] = [
    "viewer",
    "support",
    "billing_admin",
    "ops_admin",
    "super_admin",
  ];
  if (order.indexOf(current) < order.indexOf(required)) {
    throw new Error(`role_required: ${required}`);
  }
}
