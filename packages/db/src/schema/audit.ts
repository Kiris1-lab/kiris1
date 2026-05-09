import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { tenants, users, internalUsers } from "./identity.js";

/**
 * Audit log — DESIGN.md §6.6. Standard tier: 1-year retention. HIPAA tier:
 * 6-year retention (lifecycle policy on the underlying RDS backup + a TTL job
 * on the table itself). NEVER contains PHI; references only.
 */
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  requestId: text("request_id"),
  success: boolean("success").notNull().default(true),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
  tierAtTime: text("tier_at_time").notNull(),
  extra: jsonb("extra_json"),
});

/** Internal admin audit log — DESIGN §15.1. 7-year retention. */
export const internalAuditLog = pgTable("internal_audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  internalUserId: uuid("internal_user_id")
    .notNull()
    .references(() => internalUsers.id),
  action: text("action").notNull(),
  targetTenantId: uuid("target_tenant_id"),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  success: boolean("success").notNull().default(true),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
  /** Mandatory free-text justification for write actions. */
  justification: text("justification"),
});

/**
 * Customer-granted support sessions — DESIGN §15.5. The ONLY way internal
 * staff can read raw module content. Auto-expires; revocable.
 */
export const supportSessions = pgTable("support_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  internalUserId: uuid("internal_user_id")
    .notNull()
    .references(() => internalUsers.id),
  targetTenantId: uuid("target_tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  grantedByTenantUserId: uuid("granted_by_tenant_user_id")
    .notNull()
    .references(() => users.id),
  scope: text("scope").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});
