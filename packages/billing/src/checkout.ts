import type Stripe from "stripe";
import { getStripe } from "./stripe.js";

/**
 * Stripe Checkout — the single way customers initially capture a card and
 * subscribe (DESIGN §8.3).
 *
 * No trial, charge immediate (DESIGN §7.2). After the session completes the
 * webhook (`checkout.session.completed`) flips `tenants.status` to active and
 * mirrors the subscription to our DB.
 */

export interface CreateCheckoutSessionInput {
  tenantId: string;
  /** Stripe Price ID for the chosen plan + cycle. */
  priceId: string;
  /** Quantity for seat-based products (Team/Pro). 1 for Starter. */
  quantity: number;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  /** Optional Stripe Customer ID — preferred when we already have one. */
  customerId?: string;
  promotionCode?: string;
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: input.priceId, quantity: input.quantity }],
    customer: input.customerId,
    customer_email: input.customerId ? undefined : input.customerEmail,
    client_reference_id: input.tenantId,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    allow_promotion_codes: !input.promotionCode,
    discounts: input.promotionCode ? [{ promotion_code: input.promotionCode }] : undefined,
    subscription_data: {
      metadata: { tenantId: input.tenantId },
    },
    metadata: { tenantId: input.tenantId },
  });
}
