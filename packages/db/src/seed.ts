/**
 * Seed script — local development only.
 *   pnpm --filter @kiris/db db:seed
 *
 * Creates one tenant, two users, two folders, two modules, and a handful
 * of slides so the dashboard + editor have something to display when
 * USE_API=true is flipped on.
 *
 * Idempotent: ON CONFLICT DO NOTHING by id where possible.
 */

import { getDb, getPool, withTenant } from "./client.js";
import * as schema from "./schema/index.js";

const TENANT_ID = "00000000-0000-0000-0000-000000000001";
const USER_ID = "00000000-0000-0000-0000-000000000010";
const USER2_ID = "00000000-0000-0000-0000-000000000011";

async function main() {
  const db = getDb();

  await db
    .insert(schema.tenants)
    .values({
      id: TENANT_ID,
      name: "Riverside Medical Center",
      plan: "team",
      status: "active",
      hipaaEnabled: false,
      aiCreditsPerSeatMonth: 100,
      narrationMinutesPerSeatMonth: 60,
      storageGbTotal: 50,
      billingMethod: "card",
      billingCycle: "monthly",
    })
    .onConflictDoNothing();

  await db
    .insert(schema.users)
    .values([
      {
        id: USER_ID,
        tenantId: TENANT_ID,
        email: "avery@example-hospital.org",
        name: "Avery Patel",
        role: "org_admin",
      },
      {
        id: USER2_ID,
        tenantId: TENANT_ID,
        email: "jordan@example-hospital.org",
        name: "Jordan Lee",
        role: "editor",
      },
    ])
    .onConflictDoNothing();

  await withTenant({ tenantId: TENANT_ID, hipaaSession: false }, async (tx) => {
    await tx
      .insert(schema.modules)
      .values({
        id: "00000000-0000-0000-0000-0000000000a1",
        tenantId: TENANT_ID,
        title: "Hand hygiene refresher for med-surg nurses",
        status: "ready",
        createdBy: USER_ID,
        version: 1,
        authoringMode: "express",
        learningObjectives: [
          { id: "o1", text: "Identify the 5 moments for hand hygiene.", bloom: "identify" },
          { id: "o2", text: "Demonstrate proper technique in under 20 seconds.", bloom: "demonstrate" },
        ],
        estimatedDurationSeconds: 7 * 60,
      })
      .onConflictDoNothing();

    await tx
      .insert(schema.slides)
      .values([
        {
          id: "00000000-0000-0000-0000-0000000000b1",
          tenantId: TENANT_ID,
          moduleId: "00000000-0000-0000-0000-0000000000a1",
          position: 1,
          type: "title",
          title: "Hand hygiene refresher",
          onScreenText: "A 7-minute refresher.",
          narrationScript: "Welcome.",
          durationSeconds: 30,
          reviewedByUser: true,
        },
        {
          id: "00000000-0000-0000-0000-0000000000b2",
          tenantId: TENANT_ID,
          moduleId: "00000000-0000-0000-0000-0000000000a1",
          position: 2,
          type: "objectives",
          title: "What you'll be able to do",
          onScreenText: "- Identify the 5 moments\n- Demonstrate proper technique",
          narrationScript:
            "By the end of this short module, you'll identify the five moments and demonstrate technique in under 20 seconds.",
          durationSeconds: 30,
          reviewedByUser: true,
        },
      ])
      .onConflictDoNothing();
  });

  await getPool().end();
  console.log("seed: ok");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
