# @kiris/admin

The internal admin console at `admin.kiris.ai`. **Step 4** deliverable. Stricter
security perimeter than `apps/app`.

DESIGN §15 hard rules in effect from day one:

- Auth: Google Workspace SSO + hardware-key MFA. No password fallback.
- Read-only by default. Write actions require role + justification field.
- Destructive actions require two-person approval.
- Never displays raw module content unless a customer-granted **support
  session** is active (DESIGN §15.5).
- All access logged in `internal_audit_log` with 7-year retention.
