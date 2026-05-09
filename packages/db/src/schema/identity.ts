import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Identity plane — DESIGN.md §5. Tenants + users sit outside the data plane
 * because they need RLS bypass for self-service signup and billing sync.
 */

export const tierEnum = pgEnum("tier", ["standard", "hipaa"]);
export const planEnum = pgEnum("plan", [
  "starter",
  "team",
  "pro",
  "team-hipaa",
  "pro-hipaa",
  "enterprise-hipaa",
]);
export const tenantStatusEnum = pgEnum("tenant_status", [
  "active",
  "past_due",
  "suspended",
  "canceled",
  "deleted",
]);
export const dunningStateEnum = pgEnum("dunning_state", [
  "current",
  "failed_d0",
  "failed_d3",
  "failed_d7",
  "failed_d14",
  "failed_d21",
]);
export const billingMethodEnum = pgEnum("billing_method", ["card", "ach", "wire", "invoice"]);
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "annual"]);
export const userRoleEnum = pgEnum("user_role", ["org_admin", "team_admin", "editor", "viewer"]);

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: tenantStatusEnum("status").notNull().default("active"),
  plan: planEnum("plan").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),

  hipaaEnabled: boolean("hipaa_enabled").notNull().default(false),
  hipaaEnabledAt: timestamp("hipaa_enabled_at", { withTimezone: true }),
  hipaaBaaVersion: text("hipaa_baa_version"),
  hipaaBaaAcceptedBy: uuid("hipaa_baa_accepted_by"),

  aiCreditsPerSeatMonth: integer("ai_credits_per_seat_month").notNull().default(0),
  narrationMinutesPerSeatMonth: integer("narration_minutes_per_seat_month").notNull().default(0),
  storageGbTotal: integer("storage_gb_total").notNull().default(0),
  autoApprovalPolicy: jsonb("auto_approval_policy_json").$type<Record<string, unknown>>(),

  billingMethod: billingMethodEnum("billing_method").notNull().default("card"),
  billingCycle: billingCycleEnum("billing_cycle").notNull().default("monthly"),
  billingEmail: text("billing_email"),
  billingAddress: jsonb("billing_address_json"),
  taxId: text("tax_id"),
  dunningState: dunningStateEnum("dunning_state").notNull().default("current"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name").notNull(),
    role: userRoleEnum("role").notNull().default("editor"),
    mfaEnabled: boolean("mfa_enabled").notNull().default(false),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    authProviderId: text("auth_provider_id"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    aiCreditsOverrideUntil: timestamp("ai_credits_override_until", { withTimezone: true }),
    aiCreditsOverrideAmount: integer("ai_credits_override_amount"),
    narrationOverrideUntil: timestamp("narration_override_until", { withTimezone: true }),
    narrationOverrideAmount: integer("narration_override_amount"),
  },
  (t) => ({
    tenantEmailIdx: index("users_tenant_email_idx").on(t.tenantId, t.email),
  }),
);

/**
 * Internal staff — separate table from customer users (DESIGN §5, §15).
 * Lives in same DB but a different schema in production for clarity; for
 * Step 3 it's the same `public` schema with stricter RLS.
 */
export const internalUsers = pgTable("internal_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(), // viewer | support | billing_admin | ops_admin | super_admin
  ssoSubjectId: text("sso_subject_id"),
  mfaEnrolled: boolean("mfa_enrolled").notNull().default(false),
  hardwareKeyId: text("hardware_key_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
