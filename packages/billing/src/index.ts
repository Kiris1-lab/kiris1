/**
 * @kiris/billing — Stripe integration. See DESIGN.md §8.
 *
 * Pricing data exported here so marketing + app + admin all read from one
 * source. Stripe API client + webhook router land in Step 4.
 *
 * Hard rule (§6, §8): Stripe never sees PHI.
 */
export * from "./plans.js";
