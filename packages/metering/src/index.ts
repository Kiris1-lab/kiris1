/**
 * @kiris/metering — usage events + daily rollups. See DESIGN §8.6.
 *
 * Internal usage_daily is the source of truth. A nightly job reports overage
 * counts to Stripe via subscriptionItems.createUsageRecord(action=set).
 *
 * Hard rule: NEVER report PHI, module names, or user content — only counts.
 */
export type EventType =
  | "ai_credit"
  | "narration_neural_min"
  | "narration_generative_min"
  | "storage_gb_month"
  | "module_created";
