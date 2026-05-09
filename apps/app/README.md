# @kiris/app

The authoring app at `app.kiris.ai`. **Step 2** deliverable.

Implements DESIGN §10 (authoring), §16.11 (app design direction), and the
visible portion of §10.5 (per-seat caps). Persistence is mocked in
`lib/mock-store.ts` — real RDS + Drizzle land in Step 3 alongside `apps/api`
and `packages/db`.

## Routes

```
/                                  — Dashboard (module list, "New module")
/new                               — Choose Express AI vs Guided AI
/new/express                       — Express AI form (3 inputs, PHI banner)
/new/express/generating            — Narrated progress screen → editor
/new/guided                        — Guided AI outline form
/modules/[id]                      — Editor (3-column, AI helpers, etc.)
/modules/[id]/preview              — Preview player (mimics SCORM player)
/usage/request                     — Request more AI / narration usage
/cap-requests                      — Admin approval queue
```

## Layout pattern

- Workspace pages (dashboard, new, usage, cap-requests) share the `TopNav` via
  the `(workspace)` route group.
- The editor and preview have their own bare layouts because they own the
  whole viewport (DESIGN §16.11).

## Security baseline (same as `apps/marketing`)

- Per-request nonce CSP via `middleware.ts`.
- HSTS preload, X-Frame-Options DENY, locked-down Permissions-Policy.
- No client-side calls to Anthropic, Polly, Comprehend, or Stripe-secret keys
  — all such calls go through `@kiris/api` in Step 3.

## Local dev

```bash
pnpm --filter @kiris/app dev
# http://localhost:3001
```
