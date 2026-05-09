import { getPool } from "./client.js";
import { RLS_SQL } from "./rls.js";

/** Applies the generated RLS policies. Idempotent. Run after every migration. */
async function main() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query(RLS_SQL);
    console.log("RLS policies applied");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
