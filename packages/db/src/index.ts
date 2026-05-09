/**
 * @kiris/db — placeholder.
 *
 * In Step 3 this package will hold:
 *   - Drizzle schema mirroring DESIGN.md §5
 *   - SQL migrations
 *   - Postgres RLS policies (tenant_id + hipaa_session)
 *   - Connection pool factory + transactional helpers that SET app.tenant_id
 *
 * Hard rule (§6.1, §6.5): every PHI-bearing table is RLS-protected.
 * App code is NOT the only barrier.
 */
export const placeholder = true;
