import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDb, getPool } from "./client.js";

/** Runs all pending Drizzle migrations from ./drizzle, then exits. */
async function main() {
  const db = getDb();
  await migrate(db, { migrationsFolder: "./drizzle" });
  await getPool().end();
  console.log("migrations applied");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
