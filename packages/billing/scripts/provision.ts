/**
 * One-shot script: create Stripe Products + Prices for every Kiris plan.
 *
 *   pnpm --filter @kiris/billing stripe:provision
 *
 * Outputs the IDs as env-var lines you can paste into Secrets Manager. Idempotent:
 * if a product with the same `metadata.kiris_plan_id` exists, the script reuses
 * it instead of creating a duplicate.
 */

import { getStripe } from "../src/stripe.js";
import { STANDARD_PLANS, HIPAA_PLANS } from "../src/plans.js";

async function findProductByPlanId(planId: string) {
  const stripe = getStripe();
  for await (const product of stripe.products.list({ limit: 100 })) {
    if (product.metadata?.kiris_plan_id === planId) return product;
  }
  return null;
}

async function ensurePlan(plan: typeof STANDARD_PLANS[number]) {
  const stripe = getStripe();
  let product = await findProductByPlanId(plan.id);
  if (!product) {
    product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: { kiris_plan_id: plan.id, kiris_tier: plan.tier },
    });
    console.log(`created product: ${plan.id} → ${product.id}`);
  } else {
    console.log(`reused product: ${plan.id} → ${product.id}`);
  }

  const monthly = await stripe.prices.create({
    product: product.id,
    nickname: `${plan.name} monthly`,
    unit_amount: plan.monthlyUsd * 100,
    currency: "usd",
    recurring: { interval: "month" },
    metadata: { kiris_plan_id: plan.id, cycle: "monthly" },
  });
  console.log(`  monthly price: ${monthly.id}`);

  const annual = await stripe.prices.create({
    product: product.id,
    nickname: `${plan.name} annual`,
    unit_amount: plan.annualUsd * 100,
    currency: "usd",
    recurring: { interval: "year" },
    metadata: { kiris_plan_id: plan.id, cycle: "annual" },
  });
  console.log(`  annual price:  ${annual.id}`);

  return { plan, productId: product.id, monthlyPriceId: monthly.id, annualPriceId: annual.id };
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not set");
    process.exit(1);
  }
  const out: { id: string; monthly: string; annual: string }[] = [];
  for (const plan of [...STANDARD_PLANS, ...HIPAA_PLANS]) {
    const r = await ensurePlan(plan);
    out.push({ id: plan.id, monthly: r.monthlyPriceId, annual: r.annualPriceId });
  }

  console.log("\n# Paste into Secrets Manager:");
  for (const r of out) {
    const upper = r.id.toUpperCase().replace(/-/g, "_");
    console.log(`STRIPE_PRICE_${upper}_MONTHLY=${r.monthly}`);
    console.log(`STRIPE_PRICE_${upper}_ANNUAL=${r.annual}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
