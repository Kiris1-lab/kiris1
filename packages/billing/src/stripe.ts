import Stripe from "stripe";

/**
 * Single Stripe client used by the API + admin console + provisioner script.
 * Lazy so packages that import this without using it don't fail at load time.
 *
 * Hard rule: PHI never reaches Stripe (DESIGN §6, §8). Inputs to this module
 * carry org name, billing email, plan, seat count, usage counts only.
 */

let _client: Stripe | undefined;

export function getStripe(): Stripe {
  if (_client) return _client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _client = new Stripe(key);
  return _client;
}
