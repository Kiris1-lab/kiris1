/**
 * Mock data for the admin console UI. Replaced in Step 5 / production by
 * read-replica queries against the schema in @kiris/db.
 *
 * Hard rule (DESIGN §15.6): the read-replica role has grants only against
 * aggregate views + audit + billing. NEVER against modules.content_json,
 * assets, narration audio, or user content — unless a support session row
 * authorizes the reader.
 */

export interface AdminTenant {
  id: string;
  name: string;
  tier: "standard" | "hipaa";
  plan: string;
  status: "active" | "past_due" | "suspended" | "canceled";
  mrrUsd: number;
  seats: number;
  modules: number;
  signupAt: string;
}

export const TENANTS: AdminTenant[] = [
  {
    id: "t_riverside",
    name: "Riverside Medical Center",
    tier: "standard",
    plan: "team",
    status: "active",
    mrrUsd: 399,
    seats: 8,
    modules: 41,
    signupAt: "2026-02-14T00:00:00.000Z",
  },
  {
    id: "t_pinnacle",
    name: "Pinnacle Health",
    tier: "hipaa",
    plan: "team-hipaa",
    status: "active",
    mrrUsd: 799,
    seats: 9,
    modules: 18,
    signupAt: "2026-03-22T00:00:00.000Z",
  },
  {
    id: "t_summit",
    name: "Summit Children's Hospital",
    tier: "standard",
    plan: "pro",
    status: "active",
    mrrUsd: 1199,
    seats: 22,
    modules: 122,
    signupAt: "2025-11-04T00:00:00.000Z",
  },
  {
    id: "t_oakhill",
    name: "Oakhill Family Practice",
    tier: "standard",
    plan: "starter",
    status: "past_due",
    mrrUsd: 79,
    seats: 1,
    modules: 4,
    signupAt: "2026-04-01T00:00:00.000Z",
  },
];

export interface AdminAuditEvent {
  id: string;
  ts: string;
  tenant: string;
  actor: string;
  action: string;
  target: string;
  success: boolean;
  ip: string;
  requestId: string;
}

export const AUDIT_EVENTS: AdminAuditEvent[] = [
  {
    id: "a_1",
    ts: "2026-05-09T13:42:11.000Z",
    tenant: "Riverside Medical Center",
    actor: "avery@example-hospital.org",
    action: "POST /v1/generate/express",
    target: "module:m_hand_hygiene",
    success: true,
    ip: "73.12.4.118",
    requestId: "rq_01HVZ…",
  },
  {
    id: "a_2",
    ts: "2026-05-09T11:18:02.000Z",
    tenant: "Pinnacle Health",
    actor: "marisol@pinnacle.org",
    action: "POST /v1/scrubber/text",
    target: "decision:block",
    success: true,
    ip: "10.4.0.71",
    requestId: "rq_01HVZ…",
  },
  {
    id: "a_3",
    ts: "2026-05-09T09:03:55.000Z",
    tenant: "Oakhill Family Practice",
    actor: "stripe-webhook",
    action: "invoice.payment_failed",
    target: "invoice:in_…",
    success: true,
    ip: "stripe",
    requestId: "rq_01HVZ…",
  },
];

export interface SupportSessionRow {
  id: string;
  tenant: string;
  internalUser: string;
  scope: string;
  expiresAt: string;
  status: "pending_customer" | "active" | "expired" | "revoked";
}

export const SUPPORT_SESSIONS: SupportSessionRow[] = [
  {
    id: "ss_1",
    tenant: "Pinnacle Health",
    internalUser: "ops@kiris.ai",
    scope: "billing dispute investigation",
    expiresAt: "2026-05-09T18:00:00.000Z",
    status: "pending_customer",
  },
];

export interface InvoiceRow {
  id: string;
  tenant: string;
  status: "open" | "paid" | "uncollectible";
  totalUsd: number;
  dueAt: string;
}

export const OPEN_INVOICES: InvoiceRow[] = [
  { id: "in_1", tenant: "Oakhill Family Practice", status: "open", totalUsd: 79, dueAt: "2026-05-12" },
  { id: "in_2", tenant: "Pinnacle Health", status: "open", totalUsd: 121.4, dueAt: "2026-05-29" },
];

export const KPI = {
  tenants: TENANTS.length,
  hipaaShare: TENANTS.filter((t) => t.tier === "hipaa").length / TENANTS.length,
  mrrUsd: TENANTS.reduce((acc, t) => acc + t.mrrUsd, 0),
  arrUsd: TENANTS.reduce((acc, t) => acc + t.mrrUsd, 0) * 12,
  signupsThisWeek: 3,
  churnThisMonth: 1,
  activeSupportSessions: SUPPORT_SESSIONS.length,
};
