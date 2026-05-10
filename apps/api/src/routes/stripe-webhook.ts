import type { FastifyPluginAsync } from "fastify";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@kiris/db";
import { routeStripeEvent, type SideEffect } from "@kiris/billing";
import { loadEnv } from "../env.js";

/**
 * Stripe webhook handler — DESIGN §8.11.
 *
 * Hard rules:
 *   - The endpoint is PUBLIC; signature verification is the auth mechanism.
 *   - All events are stored raw in `billing_events` BEFORE side-effects —
 *     idempotent on `stripe_event_id` so retries don't double-apply.
 *   - The raw-body content-type parser is registered inside an explicit
 *     child plugin scope so other JSON routes still receive parsed objects.
 *   - Stripe never sees PHI; no PHI ever appears in event payloads.
 */
const stripeWebhookRoute: FastifyPluginAsync = async (app) => {
  const env = loadEnv();
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    app.log.warn(
      "Stripe webhook handler disabled — STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set",
    );
    return;
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  // Encapsulated child plugin — addContentTypeParser is scoped to this register
  // call, so other routes' JSON bodies are parsed normally.
  await app.register(async (childApp) => {
    childApp.addContentTypeParser("application/json", { parseAs: "buffer" }, (_req, body, done) =>
      done(null, body),
    );

    childApp.post(
      "/v1/webhooks/stripe",
      { config: { public: true, audit: false, csrf: false } },
      async (req, reply) => {
        const signature = req.headers["stripe-signature"];
        if (typeof signature !== "string") {
          return reply.code(400).send({ error: "missing_signature" });
        }

        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(
            req.body as Buffer,
            signature,
            env.STRIPE_WEBHOOK_SECRET!,
          );
        } catch (err) {
          req.log.warn({ err }, "stripe signature verification failed");
          return reply.code(400).send({ error: "bad_signature" });
        }

        const db = getDb();

        try {
          const [stored] = await db
            .insert(schema.billingEvents)
            .values({
              tenantId: null,
              eventType: event.type,
              stripeEventId: event.id,
              payload: event as unknown as Record<string, unknown>,
            })
            .onConflictDoNothing({ target: schema.billingEvents.stripeEventId })
            .returning();

          if (!stored) {
            req.log.info({ stripeEventId: event.id }, "duplicate stripe event ignored");
            return reply.code(200).send({ received: true, duplicate: true });
          }

          const effects = routeStripeEvent(event);
          for (const effect of effects) {
            await applySideEffect(db, effect, req.log);
          }

          await db
            .update(schema.billingEvents)
            .set({ processedAt: new Date() })
            .where(eq(schema.billingEvents.stripeEventId, event.id));
        } catch (err) {
          req.log.error({ err, stripeEventId: event.id }, "stripe webhook processing failed");
          return reply.code(500).send({ error: "processing_failed" });
        }

        return reply.code(200).send({ received: true });
      },
    );
  });
};

/**
 * Apply a single billing side-effect. Pure handler lives in @kiris/billing
 * and is unit-testable; this function performs the actual DB writes against
 * the un-tenanted billing tables (RLS bypassed because Stripe events arrive
 * with no tenant session).
 */
async function applySideEffect(
  db: ReturnType<typeof getDb>,
  effect: SideEffect,
  log: { warn: (o: object, msg?: string) => void },
): Promise<void> {
  switch (effect.kind) {
    case "noop":
      return;

    case "tenant.subscription_active":
    case "tenant.subscription_past_due":
    case "tenant.subscription_canceled": {
      if (!effect.tenantId) {
        log.warn({ effect }, "subscription side-effect missing tenantId");
        return;
      }
      const status =
        effect.kind === "tenant.subscription_active"
          ? "active"
          : effect.kind === "tenant.subscription_past_due"
            ? "past_due"
            : "canceled";
      const update: Record<string, unknown> = { status };
      const payload = effect.payload ?? {};
      if (typeof payload.stripeCustomerId === "string") {
        update.stripeCustomerId = payload.stripeCustomerId;
      }
      if (typeof payload.stripeSubscriptionId === "string") {
        update.stripeSubscriptionId = payload.stripeSubscriptionId;
      }
      await db.update(schema.tenants).set(update).where(eq(schema.tenants.id, effect.tenantId));
      return;
    }

    case "invoice.upserted": {
      const p = effect.payload ?? {};
      const stripeInvoiceId = typeof p.stripeInvoiceId === "string" ? p.stripeInvoiceId : null;
      if (!stripeInvoiceId) {
        log.warn({ effect }, "invoice side-effect missing stripeInvoiceId");
        return;
      }
      // Resolve tenantId from stripe customer mapping. If we can't resolve
      // (e.g. checkout in flight, customer not yet linked), skip — a later
      // event in the lifecycle will populate the row.
      const customerId = typeof p.customerId === "string" ? p.customerId : null;
      if (!customerId) return;
      const [tenant] = await db
        .select({ id: schema.tenants.id })
        .from(schema.tenants)
        .where(eq(schema.tenants.stripeCustomerId, customerId))
        .limit(1);
      if (!tenant) return;

      const subtotal = numberOrZero(p.subtotalUsdCents);
      const tax = numberOrZero(p.taxUsdCents);
      const total = numberOrZero(p.totalUsdCents);
      const status = mapInvoiceStatus(typeof p.status === "string" ? p.status : null);
      const now = new Date();

      await db
        .insert(schema.invoices)
        .values({
          tenantId: tenant.id,
          stripeInvoiceId,
          periodStart: now,
          periodEnd: now,
          subtotalUsdCents: subtotal,
          taxUsdCents: tax,
          totalUsdCents: total,
          status,
          hostedInvoiceUrl: typeof p.hostedInvoiceUrl === "string" ? p.hostedInvoiceUrl : null,
          pdfUrl: typeof p.pdfUrl === "string" ? p.pdfUrl : null,
        })
        .onConflictDoUpdate({
          target: schema.invoices.stripeInvoiceId,
          set: {
            subtotalUsdCents: subtotal,
            taxUsdCents: tax,
            totalUsdCents: total,
            status,
            hostedInvoiceUrl: typeof p.hostedInvoiceUrl === "string" ? p.hostedInvoiceUrl : null,
            pdfUrl: typeof p.pdfUrl === "string" ? p.pdfUrl : null,
          },
        });
      return;
    }

    case "payment_method.upserted": {
      const p = effect.payload ?? {};
      const stripePaymentMethodId =
        typeof p.stripePaymentMethodId === "string" ? p.stripePaymentMethodId : null;
      if (!stripePaymentMethodId) return;
      const customerId = typeof p.customerId === "string" ? p.customerId : null;
      if (!customerId) return;
      const [tenant] = await db
        .select({ id: schema.tenants.id })
        .from(schema.tenants)
        .where(eq(schema.tenants.stripeCustomerId, customerId))
        .limit(1);
      if (!tenant) return;

      await db
        .insert(schema.paymentMethods)
        .values({
          tenantId: tenant.id,
          stripePaymentMethodId,
          kind: typeof p.kind === "string" ? p.kind : "card",
          last4: typeof p.last4 === "string" ? p.last4 : null,
          brand: typeof p.brand === "string" ? p.brand : null,
          expMonth: typeof p.expMonth === "number" ? p.expMonth : null,
          expYear: typeof p.expYear === "number" ? p.expYear : null,
        })
        .onConflictDoUpdate({
          target: schema.paymentMethods.stripePaymentMethodId,
          set: {
            kind: typeof p.kind === "string" ? p.kind : "card",
            last4: typeof p.last4 === "string" ? p.last4 : null,
            brand: typeof p.brand === "string" ? p.brand : null,
            expMonth: typeof p.expMonth === "number" ? p.expMonth : null,
            expYear: typeof p.expYear === "number" ? p.expYear : null,
          },
        });
      return;
    }
  }
}

function numberOrZero(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function mapInvoiceStatus(s: string | null): "draft" | "open" | "paid" | "void" | "uncollectible" {
  switch (s) {
    case "draft":
    case "open":
    case "paid":
    case "void":
    case "uncollectible":
      return s;
    default:
      return "open";
  }
}

export default stripeWebhookRoute;
