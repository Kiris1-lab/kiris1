import { withTenant, schema } from "@kiris/db";
import { UNITS, type UsageRecord } from "./types.js";

/**
 * Append a usage event. Cheap. Daily rollups are computed by aggregateUsageForDay.
 *
 * Hard rule (DESIGN §6, §8): never serialize PHI here. The caller should
 * pass tenantId, userId, eventType, quantity, and at most an opaque refId.
 */
export async function recordUsage(
  hipaaSession: boolean,
  ev: UsageRecord,
): Promise<void> {
  await withTenant({ tenantId: ev.tenantId, hipaaSession }, async (db) => {
    await db.insert(schema.usageEvents).values({
      tenantId: ev.tenantId,
      userId: ev.userId,
      eventType: ev.eventType,
      quantity: ev.quantity,
      unit: UNITS[ev.eventType],
      refId: ev.refId ?? null,
    });
  });
}
