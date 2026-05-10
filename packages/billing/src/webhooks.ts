import type Stripe from "stripe";

/**
 * Webhook event router. The actual signature verification + raw event
 * persistence live in `apps/api/src/routes/stripe-webhook.ts` so we can use
 * Fastify's raw-body parsing without leaking it to other packages.
 *
 * This module only contains the HANDLERS — pure functions that take an event
 * and return a list of side-effects (DB writes) the API should perform. Pure
 * handlers are easy to unit-test.
 */

export interface SideEffect {
  kind:
    | "tenant.subscription_active"
    | "tenant.subscription_past_due"
    | "tenant.subscription_canceled"
    | "invoice.upserted"
    | "payment_method.upserted"
    | "noop";
  tenantId?: string;
  payload?: Record<string, unknown>;
}

export function routeStripeEvent(event: Stripe.Event): SideEffect[] {
  switch (event.type) {
    case "checkout.session.completed": {
      const sess = event.data.object as Stripe.Checkout.Session;
      return [
        {
          kind: "tenant.subscription_active",
          tenantId: sess.client_reference_id ?? undefined,
          payload: {
            stripeCustomerId: typeof sess.customer === "string" ? sess.customer : undefined,
            stripeSubscriptionId:
              typeof sess.subscription === "string" ? sess.subscription : undefined,
          },
        },
      ];
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const tenantId = (sub.metadata?.tenantId as string | undefined) ?? undefined;
      const status = sub.status;
      const kind: SideEffect["kind"] =
        status === "past_due" || status === "unpaid"
          ? "tenant.subscription_past_due"
          : status === "canceled" || status === "incomplete_expired"
            ? "tenant.subscription_canceled"
            : "tenant.subscription_active";
      return [{ kind, tenantId, payload: { status } }];
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      return [
        {
          kind: "tenant.subscription_canceled",
          tenantId: (sub.metadata?.tenantId as string | undefined) ?? undefined,
        },
      ];
    }
    case "invoice.created":
    case "invoice.updated":
    case "invoice.finalized":
    case "invoice.paid":
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      return [
        {
          kind: "invoice.upserted",
          payload: {
            stripeInvoiceId: inv.id,
            customerId: typeof inv.customer === "string" ? inv.customer : null,
            subtotalUsdCents: inv.subtotal,
            taxUsdCents: inv.tax ?? 0,
            totalUsdCents: inv.total,
            status: inv.status,
            hostedInvoiceUrl: inv.hosted_invoice_url,
            pdfUrl: inv.invoice_pdf,
          },
        },
      ];
    }
    case "payment_method.attached":
    case "payment_method.updated": {
      const pm = event.data.object as Stripe.PaymentMethod;
      return [
        {
          kind: "payment_method.upserted",
          payload: {
            stripePaymentMethodId: pm.id,
            customerId: typeof pm.customer === "string" ? pm.customer : null,
            kind: pm.type,
            last4: pm.card?.last4,
            brand: pm.card?.brand,
            expMonth: pm.card?.exp_month,
            expYear: pm.card?.exp_year,
          },
        },
      ];
    }
    default:
      return [{ kind: "noop" }];
  }
}
