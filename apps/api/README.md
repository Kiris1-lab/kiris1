# @kiris/api

Fastify API server. **Step 3** deliverable. Serves both `apps/app` and
`apps/admin`.

Step 3 ships:

- Auth middleware (Cognito JWT verify, tenant context, RLS session vars)
- Audit log middleware (every state-changing route)
- Rate limiting (per user, per tenant, per IP)
- PHI scrubber pre-flight on every user-content endpoint (Standard tier)
- Anthropic two-key router (Standard vs HIPAA-BAA org)
- Polly narration job pipeline (SQS or BullMQ)
- Module CRUD + Express AI generation pipeline + Guided AI per-field helpers
- Webhook handler for Stripe events (idempotent on event ID)
