# @kiris/billing

Stripe integration. See `DESIGN.md` §8. Currently exports only the pricing
plans constants; full Stripe client, webhook router, dunning, and Customer
Portal hooks land in Step 4.

**Hard rule:** Stripe never sees PHI.
