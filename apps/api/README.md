# @kiris/api

Fastify API server. Serves both `apps/app` and `apps/admin`. **Step 3**
deliverable.

## Routes

```
GET    /healthz                          — public, no auth
POST   /v1/webhooks/stripe               — public, signature-verified

GET    /v1/modules                       — list tenant's modules
GET    /v1/modules/:id                   — module detail (with slides)
POST   /v1/modules                       — create
PATCH  /v1/modules/:id                   — update

POST   /v1/scrubber/text                 — Comprehend Medical PHI scrub
POST   /v1/generate/express              — full module generation
POST   /v1/generate/slide-helper         — per-field ✨ helper
POST   /v1/narration/generate            — Polly synthesis (returns mp3)

GET    /v1/cap-requests                  — list pending cap requests
POST   /v1/cap-requests                  — request more usage
POST   /v1/cap-requests/:id/decide       — admin approve / deny
```

## Plugin order

1. `request-id` — assigns `x-request-id` per request, echoed back
2. `cors`, `helmet`, `rate-limit` (600 req/min/user, fallback per IP)
3. `auth` — Cognito JWT verifier (dev shim accepts `dev:userId:tenantId:tier:role`)
4. `audit` — writes one `audit_log` row per state-changing request
5. routes

## Hard rules baked into the API

- **Tenant context via `withTenant`** — every PHI-bearing query opens a
  transaction with `SET LOCAL app.tenant_id`. Postgres RLS is the second
  barrier even if app code routes to the wrong tenant.
- **Anthropic two-key router** (`services/anthropic.ts`) — Standard tenants
  use the standard org key; HIPAA tenants use the BAA-covered org key with
  Zero Data Retention. Server-side only.
- **Never log raw prompts or responses.** `request_id`, token counts, and
  `kind` only.
- **Stripe webhook idempotency** keyed on `stripe_event_id`.
- **Stripe never sees PHI.**
- **PHI scrubber pre-flight on Standard tier** for every user-content
  endpoint.

## Local dev

```bash
# Bring up Postgres locally and set DATABASE_URL.
pnpm --filter @kiris/db db:migrate
pnpm --filter @kiris/db db:rls:apply

# Start the API.
pnpm --filter @kiris/api dev
# http://localhost:4000

# Send a request with the dev token.
curl -H 'authorization: bearer dev:u_dev:00000000-0000-0000-0000-000000000001:standard:org_admin' \
  http://localhost:4000/v1/modules
```

## Production

- Hosted on AWS Fargate or Lambda + API Gateway (decision pending Phase 1
  infra step).
- Secrets from AWS Secrets Manager, never the file system.
- Behind WAF rules for OWASP top 10.
- One process per zone for blue/green; rolling deploys via CodeDeploy.
