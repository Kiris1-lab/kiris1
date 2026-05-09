/**
 * @kiris/billing — Stripe integration. See DESIGN §8.
 *
 * Hard rule (§6, §8): Stripe never sees PHI. All inputs to this package
 * carry org name, billing email, plan, seat count, usage counts only.
 */

export * from "./plans.js";
export { getStripe } from "./stripe.js";
export { createCheckoutSession, type CreateCheckoutSessionInput } from "./checkout.js";
export { createPortalSession } from "./portal.js";
export { routeStripeEvent, type SideEffect } from "./webhooks.js";
export {
  computeDunningState,
  shouldHardDelete,
  dunningCustomerMessage,
  HARD_DELETE_THRESHOLD_DAYS,
  type DunningState,
  type DunningInputs,
} from "./dunning.js";
