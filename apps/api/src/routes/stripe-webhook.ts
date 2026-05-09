import type { FastifyPluginAsync } from "fastify";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@kiris/db";
import { loadEnv } from "../env.js";

/**
 * Stripe webhook handler — DESIGN §8.11.
 *
 * Hard rules:
 *   - The endpoint is PUBLIC; signature verification is the auth mechanism.
 *   - All events are stored raw in `billing_events` BEFORE processing —
 *     idempotent on `stripe_event_id` so retries don't double-apply.
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

  // Pin to the SDK's default API version so we don't lock to a string the
  // installed Stripe types don't recognize.
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  // Stripe requires the raw body for signature verification.
  app.addContentTypeParser("application/json", { parseAs: "buffer" }, (_req, body, done) =>
    done(null, body),
  );

  app.post(
    "/v1/webhooks/stripe",
    { config: { public: true, audit: false } },
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

      // Idempotent insert. If the event ID already exists, skip processing.
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

        // Mark processed once the side-effect handler succeeds. For Step 3 we
        // log only; subscription / invoice handlers land in Step 4 with the
        // full @kiris/billing client.
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
};

export default stripeWebhookRoute;
