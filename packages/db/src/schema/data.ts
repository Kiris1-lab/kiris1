import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { tenants, users } from "./identity.js";

/**
 * Data plane — DESIGN.md §5. Every table is RLS-protected by tenant_id.
 * HIPAA-only rows additionally require `app.hipaa_session = 'true'`.
 */

export const folderKindEnum = pgEnum("folder_kind", ["personal", "team", "org"]);
export const moduleStatusEnum = pgEnum("module_status", ["draft", "ready", "exported"]);
export const authoringModeEnum = pgEnum("authoring_mode", ["express", "guided"]);
export const slideTypeEnum = pgEnum("slide_type", [
  "title",
  "objectives",
  "concept",
  "demonstration",
  "knowledge_check",
  "scenario",
  "summary",
  "final_check",
]);
export const exportFormatEnum = pgEnum("export_format", [
  "scorm12",
  "scorm2004",
  "xapi",
  "mp4",
  "html5",
]);
export const phiDecisionEnum = pgEnum("phi_decision", ["allow", "confirm", "block"]);
export const capRequestStatusEnum = pgEnum("cap_request_status", [
  "pending",
  "approved",
  "denied",
]);
export const capKindEnum = pgEnum("cap_kind", ["ai_credits", "narration_minutes"]);

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ tenantIdx: index("teams_tenant_idx").on(t.tenantId) }),
);

export const teamMembers = pgTable(
  "team_members",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
  },
  (t) => ({ pk: uniqueIndex("team_members_pk").on(t.teamId, t.userId) }),
);

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    ownerUserId: uuid("owner_user_id"),
    teamId: uuid("team_id"),
    kind: folderKindEnum("kind").notNull(),
    name: text("name").notNull(),
    parentId: uuid("parent_id"),
  },
  (t) => ({ tenantIdx: index("folders_tenant_idx").on(t.tenantId) }),
);

export const modules = pgTable(
  "modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id").references(() => folders.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    status: moduleStatusEnum("status").notNull().default("draft"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    version: integer("version").notNull().default(1),
    contentJson: jsonb("content_json").$type<Record<string, unknown>>(),
    storageClass: text("storage_class").notNull().default("standard"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    authoringMode: authoringModeEnum("authoring_mode").notNull(),
    learningObjectives: jsonb("learning_objectives_json")
      .$type<{ id: string; text: string; bloom: string }[]>()
      .notNull()
      .default([]),
    estimatedDurationSeconds: integer("estimated_duration_seconds").notNull().default(0),
  },
  (t) => ({
    tenantIdx: index("modules_tenant_idx").on(t.tenantId, t.deletedAt),
  }),
);

export const moduleVersions = pgTable("module_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  snapshot: jsonb("snapshot_json").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid("created_by").notNull(),
});

export const slides = pgTable(
  "slides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    type: slideTypeEnum("type").notNull(),
    title: text("title").notNull(),
    onScreenText: text("on_screen_text").notNull().default(""),
    narrationScript: text("narration_script").notNull().default(""),
    altText: text("alt_text").notNull().default(""),
    interaction: jsonb("interaction_json"),
    quiz: jsonb("quiz_json"),
    reviewedByUser: boolean("reviewed_by_user").notNull().default(false),
    aiConfidenceScore: real("ai_confidence_score").notNull().default(0),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tenantModuleIdx: index("slides_tenant_module_idx").on(t.tenantId, t.moduleId, t.position),
  }),
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id").references(() => modules.id, { onDelete: "set null" }),
    kind: text("kind").notNull(),
    s3Bucket: text("s3_bucket").notNull(),
    s3Key: text("s3_key").notNull(),
    sha256: text("sha256").notNull(),
    bytes: bigint("bytes", { mode: "number" }).notNull(),
    mimeType: text("mime_type").notNull(),
    storageClass: text("storage_class").notNull().default("standard"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tenantSha: uniqueIndex("assets_tenant_sha_uniq").on(t.tenantId, t.sha256),
  }),
);

export const aiGenerations = pgTable("ai_generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id").references(() => modules.id, { onDelete: "set null" }),
  model: text("model").notNull(),
  kind: text("kind").notNull(),
  apiKeyPool: text("api_key_pool").notNull(), // 'standard' | 'hipaa'
  inputTokens: integer("input_tokens").notNull().default(0),
  outputTokens: integer("output_tokens").notNull().default(0),
  costUsdMicros: bigint("cost_usd_micros", { mode: "number" }).notNull().default(0),
  requestId: text("request_id").notNull(), // anthropic request_id; never the body
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const narrationJobs = pgTable("narration_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  slideId: uuid("slide_id")
    .notNull()
    .references(() => slides.id, { onDelete: "cascade" }),
  voice: text("voice").notNull(),
  engine: text("engine").notNull(), // 'neural' | 'generative'
  charCount: integer("char_count").notNull(),
  status: text("status").notNull().default("pending"),
  pollyRequestId: text("polly_request_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const phiScrubberEvents = pgTable("phi_scrubber_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  decision: phiDecisionEnum("decision").notNull(),
  confidence: real("confidence").notNull(),
  detectedEntityTypes: jsonb("detected_entity_types_json").$type<string[]>().notNull().default([]),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
});

export const capRequests = pgTable("cap_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: capKindEnum("kind").notNull(),
  requestedAmount: integer("requested_amount").notNull(),
  currentUsage: integer("current_usage").notNull(),
  reason: text("reason").notNull(),
  status: capRequestStatusEnum("status").notNull().default("pending"),
  decidedBy: uuid("decided_by"),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  autoApproved: boolean("auto_approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const seatOverrides = pgTable("seat_overrides", {
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: capKindEnum("kind").notNull(),
  amount: integer("amount").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  grantedBy: uuid("granted_by").notNull(),
  grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const exports_ = pgTable("exports", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  format: exportFormatEnum("format").notNull(),
  s3Key: text("s3_key").notNull(),
  bytes: bigint("bytes", { mode: "number" }).notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const shareLinks = pgTable("share_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  scope: text("scope").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
});

export const usageEvents = pgTable("usage_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  eventType: text("event_type").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
  refId: text("ref_id"),
});

export const usageDaily = pgTable(
  "usage_daily",
  {
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id"),
    day: text("day").notNull(), // 'YYYY-MM-DD' (UTC)
    eventType: text("event_type").notNull(),
    quantityTotal: real("quantity_total").notNull().default(0),
  },
  (t) => ({
    pk: uniqueIndex("usage_daily_pk").on(t.tenantId, t.userId, t.day, t.eventType),
  }),
);
