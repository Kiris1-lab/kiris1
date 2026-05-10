/**
 * @kiris/db — Postgres schema, RLS policies, and connection helpers.
 * See DESIGN.md §5, §6.1, §6.5.
 *
 * Hard rule: every PHI-bearing query must be issued through `withTenant()` so
 * RLS sees the tenant context. Bypassing it is a security incident.
 */

export { getDb, getPool, withTenant, type Database } from "./client.js";
export { RLS_SQL, buildRlsSql, buildRlsAssertSql, RLS_REQUIRED_TABLES } from "./rls.js";
export * as schema from "./schema/index.js";
