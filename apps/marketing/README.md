# @kiris/marketing

The public marketing site at `kiris.ai`. Next.js 15 App Router. Hosted on
Vercel. **No PHI ever** — this app does not authenticate users or accept
uploads. The only outbound data is the contact-sales / signup form payload,
which carries identifying-but-not-PHI fields (name, email, org).

## Pages (per DESIGN §13.1)

- `/` — hero, problem/solution, three-up features, how it works, pricing teaser, final CTA
- `/product` — feature deep-dive (Express AI, Guided AI, editor, pedagogy)
- `/pricing` — both tiers + Enterprise + overage rates + cancellation policy + FAQ
- `/security` — both-tier explanation, controls, subprocessors, roadmap, contact
- `/integrations` — LMS list + export formats + roadmap
- `/customers` — placeholder while design partners ship; persona section
- `/blog` — index with placeholder posts
- `/trust` — public trust page (status, certifications, subprocessors, contact)
- `/contact-sales` — Enterprise only; form
- `/signup` — Standard tier signup; PHI-prohibited banner; password ≥ 12
- `/login` — sign-in form (handed off to `app.kiris.ai`)
- `/sitemap.xml`, `/robots.txt`, custom `not-found`

## Security

- Strict CSP set per request via `middleware.ts`. No `unsafe-inline` for
  scripts. Per-request nonce.
- Other headers in `next.config.mjs`: HSTS preload, X-Frame-Options DENY,
  X-Content-Type-Options nosniff, strict Referrer-Policy, locked-down
  Permissions-Policy.
- No client-side calls to third-party APIs. Plausible analytics is the only
  external script and is allowlisted by CSP.

## Local dev

```bash
pnpm --filter @kiris/marketing dev
# http://localhost:3000
```

## Deploying to Vercel

The marketing site deploys from the **repo root**, not from `apps/marketing/`.
All build configuration lives in the root `vercel.json`. This is required so
Vercel can run a workspace-aware `pnpm install` before Next.js framework
detection — installing only inside `apps/marketing` leaves `next` unresolved
because pnpm hoists workspace deps to the repo-root `node_modules`.

Vercel project settings:

1. **Root Directory**: `.` (repo root). Leave the "Include source files
   outside of the Root Directory" checkbox at its default — `vercel.json`
   already covers this.
2. **Framework Preset**: Next.js (or "Other"; the root `vercel.json` pins
   `framework: "nextjs"` so the preset is informational).
3. **Build & Output Settings**: leave all fields blank / on "Override = off".
   `vercel.json` provides `installCommand`, `buildCommand`, and
   `outputDirectory` (`apps/marketing/.next`).
4. **Node.js Version**: 20.x.
5. **Required env vars** (see root `.env.example`):
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional)

Only the marketing site is deployed to Vercel. `apps/app`, `apps/admin`,
and `apps/api` are deployed to AWS — do not add them as Vercel projects.
