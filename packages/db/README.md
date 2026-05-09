# @kiris/db

Drizzle schema, migrations, and Postgres RLS policies for Kiris. Currently a
placeholder — full schema lands in **Step 3** (see `DESIGN.md` §5, §6.1, §6.5).

## Planned

- Drizzle schema for every table in DESIGN §5.
- Migrations runner (drizzle-kit).
- RLS policies enforced on every PHI-bearing table:
  ```sql
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
  ```
  HIPAA-tier rows additionally require `current_setting('app.hipaa_session') = 'true'`.
- Read-replica wiring for the admin console (`apps/admin`).
- Aggregate views for admin (no row-level customer content exposed).
