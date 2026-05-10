import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolClient } from "pg";
import * as schema from "./schema/index.js";

/**
 * DB connection factory. We use node-postgres + Drizzle so we can SET LOCAL
 * inside a transaction to push tenant context into RLS.
 */

export type Database = ReturnType<typeof drizzle<typeof schema, Pool | PoolClient>>;

let _pool: Pool | undefined;

export function getPool(): Pool {
  if (_pool) return _pool;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Configure it in your environment (see root .env.example).",
    );
  }
  _pool = new Pool({
    connectionString: url,
    // RDS in production gets ssl: { rejectUnauthorized: true } via the IAM-auth wrapper.
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined,
    max: Number(process.env.DATABASE_POOL_MAX ?? "20"),
  });
  return _pool;
}

export function getDb(): Database {
  return drizzle(getPool(), { schema });
}

/**
 * Run `fn` inside a transaction that has the tenant + HIPAA session vars set.
 * Postgres RLS uses these via `current_setting('app.tenant_id', true)`.
 *
 * Hard rule: every request that touches PHI-bearing tables MUST go through
 * this helper. The Fastify middleware in `apps/api` enforces that.
 */
export async function withTenant<T>(
  ctx: { tenantId: string; hipaaSession: boolean },
  fn: (db: Database, client: PoolClient) => Promise<T>,
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // SET LOCAL is transaction-scoped — released on COMMIT/ROLLBACK.
    await client.query(`SET LOCAL app.tenant_id = $1`, [ctx.tenantId]);
    await client.query(`SET LOCAL app.hipaa_session = $1`, [ctx.hipaaSession ? "true" : "false"]);
    const tx = drizzle(client, { schema });
    const result = await fn(tx, client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    // Don't let a transient ROLLBACK failure mask the original error.
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      // Log via console.error — pino isn't available in this layer. Caller's
      // observability picks it up via the original `err` re-throw.
      console.error("withTenant: ROLLBACK failed", rollbackErr);
    }
    throw err;
  } finally {
    client.release();
  }
}
