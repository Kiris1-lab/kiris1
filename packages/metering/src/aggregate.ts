import { sql } from "drizzle-orm";
import { withTenant, schema } from "@kiris/db";

/**
 * Daily aggregator. Run nightly (cron / EventBridge schedule).
 *
 * UPSERTs (tenant_id, user_id, day, event_type, sum(quantity)) into
 * usage_daily from usage_events. Idempotent — re-running for the same day
 * recomputes the totals.
 */
export async function aggregateUsageForDay(
  tenantId: string,
  hipaaSession: boolean,
  day: string,
): Promise<{ rows: number }> {
  return withTenant({ tenantId, hipaaSession }, async (_db, client) => {
    const result = await client.query(
      `
      INSERT INTO usage_daily (tenant_id, user_id, day, event_type, quantity_total)
      SELECT
        tenant_id,
        user_id,
        $2::text AS day,
        event_type,
        SUM(quantity)::real AS quantity_total
      FROM usage_events
      WHERE tenant_id = $1
        AND ts >= ($2::date) AND ts < (($2::date) + INTERVAL '1 day')
      GROUP BY tenant_id, user_id, event_type
      ON CONFLICT (tenant_id, user_id, day, event_type)
      DO UPDATE SET quantity_total = EXCLUDED.quantity_total;
      `,
      [tenantId, day],
    );
    return { rows: result.rowCount ?? 0 };
  });
}

/**
 * Per-user usage rollup for the current month. Used by the in-app usage
 * indicator (DESIGN §10.5) and the cap-request approval queue.
 */
export async function getMonthToDateUsage(
  tenantId: string,
  userId: string,
  hipaaSession: boolean,
  now: Date = new Date(),
): Promise<Record<string, number>> {
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  return withTenant({ tenantId, hipaaSession }, async (_db, client) => {
    const result = await client.query<{ event_type: string; total: number }>(
      `
      SELECT event_type, COALESCE(SUM(quantity_total), 0)::real AS total
      FROM usage_daily
      WHERE tenant_id = $1
        AND (user_id = $2 OR user_id IS NULL)
        AND day LIKE $3 || '%'
      GROUP BY event_type
      `,
      [tenantId, userId, month],
    );
    const out: Record<string, number> = {};
    for (const row of result.rows) out[row.event_type] = Number(row.total);
    return out;
  });
}
