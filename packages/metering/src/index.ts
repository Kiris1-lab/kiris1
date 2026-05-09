/**
 * @kiris/metering — usage events + daily rollups + Stripe overage reporting.
 * See DESIGN §8.6 + §10.5.
 *
 * Hard rule: never reports PHI, module names, or user content to Stripe —
 * only counts.
 */

export * from "./types.js";
export { recordUsage } from "./record.js";
export { aggregateUsageForDay, getMonthToDateUsage } from "./aggregate.js";
export { reportOverage, type StripeReportInput } from "./stripe-reporter.js";
