import type Stripe from "stripe";
import { getStripe } from "./stripe.js";

/**
 * Stripe Customer Portal — DESIGN §8.4. Self-serve plan changes, payment
 * method updates, invoice downloads, and one-click cancellation. No
 * retention dark patterns by design.
 */
export async function createPortalSession(input: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  return getStripe().billingPortal.sessions.create({
    customer: input.customerId,
    return_url: input.returnUrl,
  });
}
