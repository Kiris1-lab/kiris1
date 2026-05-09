# Kiris

Turn screenshots, recordings, and notes into narrated, editable e-learning modules
that export to any hospital LMS.

> **Status:** Pre-launch. This repository implements the design in `DESIGN.md`
> (v0.5). Phase 1 ships the **Standard tier** only — no PHI permitted, no BAA
> required. The HIPAA tier ships in Phase 2.

## Repository layout (Turborepo monorepo)

```
apps/
  marketing/        Next.js 15 public site at kiris.ai (Vercel, no PHI)
  app/              Authoring app at app.kiris.ai (AWS, tier-aware)
  admin/            Internal console at admin.kiris.ai (AWS, stricter perimeter)
  api/              Fastify API serving the app + admin
packages/
  ui/               Design system: tokens, primitives, components (§16)
  db/               Drizzle schema, migrations, RLS policies (§5)
  scrubber/         PHI scrubber (Comprehend Medical) (§6.9)
  learning-engine/  AI generation prompts + validators (§17)
  scorm/            SCORM 1.2 / 2004 packager (§11)
  billing/          Stripe integration (§8)
  metering/         Usage events + daily rollups (§8.6)
  observability/    Sentry init wrapper + telemetry PHI scrubber
infra/              Terraform: VPC, RDS, S3 + KMS, Cognito, WAF, CloudWatch
```

## Quickstart (local dev)

Prerequisites: **Node 20+**, **pnpm 9+**.

```bash
pnpm install
cp .env.example .env.local        # fill in only what you need
pnpm dev                          # runs every app in parallel
```

Individual apps:

```bash
pnpm --filter @kiris/marketing dev    # http://localhost:3000  public site
pnpm --filter @kiris/app dev          # http://localhost:3001  authoring app
pnpm --filter @kiris/admin dev        # http://localhost:3002  internal console
pnpm --filter @kiris/api dev          # http://localhost:4000  Fastify API
```

### Optional: bring up Postgres + run the API end-to-end

```bash
# Start a local Postgres (any way you like). Set DATABASE_URL in .env.local.
pnpm --filter @kiris/db db:generate    # generate migration SQL from schema
pnpm --filter @kiris/db db:migrate     # apply migrations
pnpm --filter @kiris/db db:rls:apply   # apply RLS policies (idempotent)
pnpm --filter @kiris/db db:seed        # one tenant + two users + a module

# Smoke test the API:
curl -H 'authorization: bearer dev:00000000-0000-0000-0000-000000000010:00000000-0000-0000-0000-000000000001:standard:org_admin' \
  http://localhost:4000/v1/modules

# Flip the app from mock-store to API:
USE_API=true pnpm --filter @kiris/app dev
```

## External services & access

Security-first principle: **no secret values are committed to this repo, ever**.
`.env.example` lists every variable the apps read; production secrets live in AWS
Secrets Manager and rotate quarterly (DESIGN §6, §12).

The following accounts are required to take this beyond the marketing site. Owner
should provision and store credentials in a password manager + Secrets Manager.

| Service                | Used by              | Phase | Notes                                                      |
| ---------------------- | -------------------- | ----- | ---------------------------------------------------------- |
| **Vercel**             | `apps/marketing`     | 1     | Connect this repo; root dir = `apps/marketing`.            |
| **AWS** (us-east-1)    | infra, app, api      | 1     | Sign BAA via Artifact before HIPAA tier.                   |
| AWS Cognito            | customer auth        | 1     | User pool per environment; MFA optional Standard.          |
| AWS RDS Postgres 16    | primary DB           | 1     | KMS-encrypted, RLS enforced.                               |
| AWS S3                 | assets, exports      | 1     | KMS CMK, no public ACLs, signed URLs ≤ 5 min.              |
| AWS KMS                | envelope encryption  | 1     | One CMK per HIPAA tenant in Phase 2.                       |
| AWS Polly              | narration TTS        | 1     | Neural + Generative voices.                                |
| AWS Comprehend Medical | PHI scrubber         | 1     | `DetectPHIV2` for Standard tier.                           |
| AWS Textract           | image OCR            | 1     | Pre-step before Comprehend Medical on images.              |
| **Anthropic API**      | AI generation        | 1     | Two keys: standard + BAA-covered (Phase 2).                |
| **Stripe**             | billing              | 1     | Stripe + Stripe Tax + Stripe Invoicing + Customer Portal.  |
| **Sentry**             | error tracking       | 1     | Has BAA; PHI-scrubbed before send.                         |
| **GitHub Actions**     | CI                   | 1     | Built-in; configured under `.github/workflows/`.           |
| Google Workspace SSO   | internal admin auth  | 1     | Hardware key MFA mandatory for staff (`apps/admin`).       |

`.env.example` contains the full list of variables and where each is consumed.

## Security guardrails (read before contributing)

These are **hard constraints**.

1. **No PHI on Standard tier, ever.** Every user-input endpoint runs through the
   PHI scrubber pre-flight (`@kiris/scrubber`). Fail-closed for high-confidence
   detections.
2. **Stripe never receives PHI.** Stripe sees org name, billing email, plan, seat
   count, usage counts. Never module content, never user-uploaded materials.
3. **Tenant isolation via Postgres RLS, not just app code** (`packages/db`).
4. **No client-side calls to** Anthropic, Polly, Comprehend, or any
   Stripe-secret-key endpoint. All AI/TTS/PHI calls go through `apps/api`.
5. **No raw prompts/responses in logs.** Anthropic request_id only.
6. **Secrets in AWS Secrets Manager**, rotated quarterly. Never commit
   `.env.local`.
7. **CSP nonce-based, no `unsafe-inline`.** Configured per app.
8. **WCAG 2.2 AA** across every surface (`packages/ui` enforces tokens; tests in
   each app verify).
9. **Audit log every state-changing endpoint** (`apps/api` middleware).
10. **Two-person rule** for destructive admin actions (`apps/admin`).

A full implementation checklist lives in `DESIGN.md` §12 and `SECURITY.md`.

## Reporting security issues

Email `security@kiris.ai`. Do **not** open public GitHub issues for security
reports. Coordinated disclosure policy in `SECURITY.md`.

## Phase 1 status (Standard tier launch)

- [x] Marketing site (DESIGN §13)
- [x] Authoring app — Express + Guided AI flows, editor, preview (DESIGN §10)
- [x] Internal admin console (DESIGN §15)
- [x] API — auth, audit, scrubber, generate, narration, exports, cap requests, Stripe webhook (DESIGN §6, §8)
- [x] Postgres schema + RLS policies (DESIGN §5, §6.1)
- [x] PHI scrubber wired into every user-content endpoint (DESIGN §6.9)
- [x] Learning engine — Mayer's principles, validators, critic pass (DESIGN §17)
- [x] SCORM 1.2 packager (DESIGN §11) — pre-launch: validate against HealthStream sandbox
- [x] Stripe Checkout + Customer Portal + webhook router + dunning (DESIGN §8)
- [x] Per-seat caps + admin approval queue (DESIGN §10.5)
- [x] Terraform: VPC, RDS, S3 + KMS, Cognito, WAF, CloudWatch (DESIGN §4)
- [x] Sentry with PHI-scrubbed beforeSend across every app
- [x] CSP nonces + HSTS + per-request CSRF + per-route rate limits

## Phase 2 staged (HIPAA tier — flips on once BAAs are executed)

- [x] BAA click-to-accept page + API endpoint (`/upgrade/hipaa`)
- [x] HIPAA RLS gate (`hipaa_session` session var) in `packages/db/src/rls.ts`
- [x] HIPAA bucket policy in Terraform (no plain PUTs, no insecure transport)
- [x] Per-tenant CMK ARN field on `tenants` ready for population
- [ ] Anthropic BAA executed and BAA-org API key issued
- [ ] AWS BAA executed via Artifact
- [ ] Per-tenant KMS CMK allocation worker
- [ ] Stripe pro-ration on upgrade
- [ ] Forced MFA enrollment for editors and above at upgrade time

## License

UNLICENSED — proprietary. Internal use only until a license decision is made.
