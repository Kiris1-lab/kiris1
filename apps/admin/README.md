# @kiris/admin

Internal operator console at `admin.kiris.ai`. **Step 4** deliverable.

## Routes

```
/                       Operator dashboard (KPIs, past-due, support sessions)
/tenants                List of tenants (search, filter)
/tenants/[id]           Tenant detail (billing, caps, write actions w/ justification)
/billing                MRR by tier, ARR projection, open invoices
/usage                  Anthropic / Polly / scrubber spend (Step 5 → real)
/support-sessions       Customer-granted access (DESIGN §15.5)
/audit                  Global audit log search
/incidents              Open incidents (Step 5 → real)
/cap-requests           Cross-tenant cap-increase activity
/staff                  Internal staff + roles (super_admin only)
```

## Hard rules from DESIGN §15

- **Auth:** Google Workspace SSO + hardware-key MFA mandatory; no password
  fallback. Step 4 ships an SSO shim — `lib/session.ts`.
- **Read-only by default.** Write actions require role + justification field.
- **Destructive actions need a second approver** (super_admin actions, hard
  delete, large credits).
- **Never displays raw module content** unless a customer-granted support
  session is active. The /tenants/[id] page surfaces the support-session
  request flow rather than the content itself.
- **Strictest CSP** — no third-party scripts, ever (`middleware.ts`).
- **All access logged** to `internal_audit_log` with 7-year retention.

## Local dev

```bash
pnpm --filter @kiris/admin dev
# http://localhost:3002
```

## Production

- Hosted on AWS, separate VPC SG (DESIGN §4 diagram).
- Behind a separate WAF and IP allowlist (Kiris office + on-call VPN only).
- Hardware-key MFA verified at session start; re-prompted on
  destructive actions.
