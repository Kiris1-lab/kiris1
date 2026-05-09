# @kiris/db

Drizzle schema, migrations, and Postgres RLS policies. Implements DESIGN §5
(data model) and §6.1 / §6.5 (tenant isolation).

## Layout

```
src/
  schema/
    identity.ts       tenants, users, internal_users + enums
    data.ts           modules, slides, assets, AI/narration jobs, caps, exports
    billing.ts        invoices, payment_methods, billing_events
    audit.ts          audit_log, internal_audit_log, support_sessions
  client.ts           connection pool + withTenant() RLS helper
  rls.ts              generated RLS policy SQL (run after migrations)
  migrate.ts          drizzle-kit migrator entry point
  apply-rls.ts        apply RLS policies entry point
drizzle/              generated migration SQL (committed)
drizzle.config.ts     drizzle-kit config
```

## Hard rule: tenant context

**Every** query that touches a PHI-bearing table MUST go through `withTenant`:

```ts
import { withTenant } from "@kiris/db";

await withTenant(
  { tenantId: req.tenantId, hipaaSession: req.hipaaSession },
  async (db) => {
    return db.select().from(schema.modules);
  },
);
```

`withTenant` opens a transaction and `SET LOCAL`s `app.tenant_id` and
`app.hipaa_session`. Postgres RLS policies (see `rls.ts`) consult these via
`current_setting()`. Even with a SQL injection in app code, the database
refuses to return rows for other tenants.

## Local dev

```bash
# 1. Bring up Postgres locally (docker compose, RDS, whatever).
# 2. Set DATABASE_URL in .env.local.
# 3. Generate the initial migration:
pnpm --filter @kiris/db db:generate

# 4. Apply migrations:
pnpm --filter @kiris/db db:migrate

# 5. Apply RLS policies (always after migrate):
pnpm --filter @kiris/db db:rls:apply
```

## Production deploys

Run `db:migrate` followed by `db:rls:apply` as part of every deploy. RLS apply
is idempotent. CI should fail the deploy if either step errors.
