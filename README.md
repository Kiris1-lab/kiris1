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
  metering/         Usage events + daily rollups
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
pnpm --filter @kiris/marketing dev    # http://localhost:3000
pnpm --filter @kiris/app dev          # http://localhost:3001
pnpm --filter @kiris/admin dev        # http://localhost:3002
pnpm --filter @kiris/api dev          # http://localhost:4000
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

## License

UNLICENSED — proprietary. Internal use only until a license decision is made.
