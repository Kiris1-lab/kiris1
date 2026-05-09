# Security policy

Security is a launch-blocking concern for Kiris. This file is the authoritative
quick-reference for contributors and security researchers. The full controls live
in `DESIGN.md` §6 (Compliance Guardrails) and §12 (Security Implementation
Checklist).

## Reporting a vulnerability

Email **security@kiris.ai** with:

- A clear description of the issue and reproduction steps.
- The affected component (marketing site, app, admin, API, or a package).
- Any relevant request IDs, timestamps, and environment.

Please do **not** open a public GitHub issue, post on social media, or share
proof-of-concept code publicly until we confirm a fix has shipped. We aim to
respond within 2 business days and to remediate critical issues within 14 days.

We do not currently run a paid bug bounty. We will publicly credit researchers
who responsibly disclose, with permission.

## Hard constraints (do not break)

These are enforced in code, in CI, and in code review.

1. **No PHI on Standard tier.** All user-content endpoints route through
   `@kiris/scrubber` before any AI / TTS / storage call. High-confidence
   detections (≥ 0.85) hard-block.
2. **Stripe is PHI-free.** Stripe sees identifiers, plan, usage counts. Never
   module content, never user-uploaded materials.
3. **Tenant isolation via Postgres RLS.** App code is *not* the only barrier —
   `tenant_id = current_setting('app.tenant_id')::uuid` on every PHI-bearing
   table. HIPAA-tier rows additionally require `app.hipaa_session = true`.
4. **No client-side secrets.** Browsers must never see Anthropic, Polly,
   Comprehend, or Stripe-secret keys. All such calls go through `apps/api`.
5. **No raw prompts or responses in logs.** Log Anthropic `request_id` only.
6. **Secrets via AWS Secrets Manager.** `.env.local` is for local dev only and
   is git-ignored. Production secrets rotate quarterly.
7. **CSP is nonce-based.** No `unsafe-inline`, no wildcard sources.
8. **CSRF tokens** on every state-changing request from a browser.
9. **Rate limits** per user, per tenant, per IP on every public endpoint.
10. **Audit log every state-changing endpoint.** No PHI in log entries —
    references only.

## Data classification (DESIGN §6.2)

| Class                       | Examples                                       | Where it lives                       |
| --------------------------- | ---------------------------------------------- | ------------------------------------ |
| **PHI** (HIPAA tier only)   | EHR screenshots, narration referring patients  | HIPAA-scoped infra (CMK, S3 prefix)  |
| **Non-PHI module content**  | Generic training, admin UI, policy text        | Standard infra                       |
| **Identifying-not-PHI**     | User name, email, org, role, billing           | Stripe + Cognito                     |
| **Operational**             | Latency, errors, aggregate counts              | CloudWatch, Datadog                  |

## Vendor BAAs (HIPAA tier only — Phase 2)

Required before HIPAA tier launches: AWS, Anthropic, AWS Polly (under AWS BAA),
Sentry. Stripe will not sign a BAA — by design, no PHI ever reaches Stripe.

Phase 1 (Standard tier) requires no BAAs.

## Authentication

- **Customer auth:** AWS Cognito. MFA optional on Standard, required for HIPAA
  tier users with role ≥ Editor.
- **Internal staff auth:** Google Workspace SSO + hardware-key MFA. No password
  fallback. Stricter perimeter on `apps/admin`.

## Encryption

- TLS 1.2+ in transit on every surface (HSTS preload).
- AES-256 at rest via AWS KMS.
- HIPAA tier additionally: customer-managed KMS per tenant; field-level
  encryption on `modules.content_json` and `narration_script`.
- Backups encrypted, 35-day retention, geographically replicated.

## Audit retention

| Tier     | Retention | Events                                                                            |
| -------- | --------- | --------------------------------------------------------------------------------- |
| Standard | 1 year    | login, module CRUD, export, share, billing, role change, PHI scrubber blocks      |
| HIPAA    | 6 years   | all of above + AI generation, narration jobs, tier upgrades/downgrades            |

## Internal staff access

- Staff cannot read raw module content without a customer-granted **support
  session** (DESIGN §15.5).
- All access logged in `internal_audit_log` with mandatory justification.
- Sessions auto-expire (4 h default; 1 h HIPAA).
- Destructive admin actions (delete tenant, issue >$5K credit) require a second
  approver.

## Supply chain

- Dependabot + `pnpm audit` run on every PR.
- Secret scanning enabled at the org level.
- All workflows pinned to commit SHAs in production-affecting jobs.
- Dependencies reviewed at major-version bumps.

## Pre-launch checklist

Mirrored from DESIGN §12.

- [ ] Auth middleware on all API endpoints
- [ ] Tenant isolation via Postgres RLS, not just app code
- [ ] PHI scrubber on every user-input endpoint when Standard tier
- [ ] CSRF tokens on state-changing requests
- [ ] Per-user, per-tenant, per-IP rate limits
- [ ] Strict CSP, nonce-based, no `unsafe-inline`
- [ ] No client-side calls to Anthropic / Polly / Comprehend / Stripe-secret
- [ ] S3 bucket policies: no public ACLs; signed URLs ≤ 5 min expiry
- [ ] Secrets in AWS Secrets Manager, rotated quarterly
- [ ] WAF rules for OWASP top 10
- [ ] Snyk / Dependabot scans on every PR
- [ ] Annual third-party penetration test
- [ ] HIPAA risk assessment annually (HIPAA tier)
- [ ] Internal admin console pen test before launch
