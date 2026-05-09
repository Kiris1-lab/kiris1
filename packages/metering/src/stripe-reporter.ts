import { getStripe } from "@kiris/billing";
import type { EventType } from "./types.js";

/**
 * Nightly Stripe usage reporter — DESIGN §8.6.
 *
 * Reports OVERAGE counts to Stripe via subscriptionItems.createUsageRecord
 * with action=set so retries are idempotent. Never reports PHI, module
 * names, or user content — only counts.
 *
 * The caller (apps/api scheduled job) loads `usage_daily` totals for the
 * billing period, subtracts the plan allowance, and passes the per-tenant
 * delta in here keyed by Stripe Subscription Item ID.
 */

export interface StripeReportInput {
  /** Stripe Subscription Item ID for the metered SKU. */
  subscriptionItemId: string;
  /** Period overage in the SKU's natural unit (credits, minutes, etc). */
  quantity: number;
  /** UNIX seconds; usually `period_end - 1`. */
  timestamp: number;
  /** For logging only. NEVER send this to Stripe. */
  tenantId: string;
  eventType: EventType;
}

export async function reportOverage(input: StripeReportInput): Promise<void> {
  const stripe = getStripe();
  // Stripe SDK v17: usageRecords is on subscriptionItems.
  await stripe.subscriptionItems.createUsageRecord(input.subscriptionItemId, {
    quantity: Math.max(0, Math.round(input.quantity)),
    timestamp: input.timestamp,
    action: "set",
  });
}
