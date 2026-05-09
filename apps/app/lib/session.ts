import type { Session } from "./types.js";

/**
 * Mocked session for Step 2. Real Cognito JWT verification + tenant context
 * lands in Step 3 alongside @kiris/api. Hard-coded so the UI is stable to
 * develop against.
 */
export function getSession(): Session {
  return {
    user: {
      id: "u_demo",
      name: "Avery Patel",
      email: "avery@example-hospital.org",
      role: "org_admin",
    },
    tenant: {
      id: "t_demo",
      name: "Riverside Medical Center",
      tier: "standard",
    },
    usage: {
      aiCreditsUsed: 78,
      aiCreditsAllowance: 100,
      narrationMinutesUsed: 32,
      narrationMinutesAllowance: 60,
    },
  };
}
