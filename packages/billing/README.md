# @kiris/billing

Stripe integration. See DESIGN §8.

## Modules

- `plans.ts` — pricing constants (single source of truth for marketing + app
  + admin).
- `stripe.ts` — lazy Stripe client singleton.
- `checkout.ts` — Stripe Checkout session creation. No trial; charge
  immediate (DESIGN §7.2). `client_reference_id` carries our `tenantId`.
- `portal.ts` — Stripe Customer Portal session creation. Self-serve plan
  changes, invoices, one-click cancellation (DESIGN §8.4).
- `webhooks.ts` — pure event router. Returns `SideEffect[]` for the API to
  apply. Easy to unit-test without the Stripe SDK.
- `dunning.ts` — pure dunning state machine (DESIGN §8.9). Tested.
- `scripts/provision.ts` — idempotent script that creates Stripe Products +
  Prices for every plan and prints the env-var lines.

## Hard rule

PHI never reaches Stripe. The only fields we send are org name, billing
email, plan ID, quantity, and idempotent metadata pointers (tenantId).

## Provision Stripe products

```bash
export STRIPE_SECRET_KEY=sk_test_...
pnpm --filter @kiris/billing stripe:provision
```

Paste the printed `STRIPE_PRICE_*` lines into Secrets Manager.

## Webhook handlers

```ts
import { routeStripeEvent } from "@kiris/billing";
const effects = routeStripeEvent(event);
for (const effect of effects) {
  // apply effect.kind: "tenant.subscription_active" | ...
}
```

Idempotent on `event.id` — verified before processing in
`apps/api/src/routes/stripe-webhook.ts`.
