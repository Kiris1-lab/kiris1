# @kiris/metering

Usage events + daily aggregation + Stripe overage reporting. See DESIGN §8.6.

## Modules

- `types.ts` — `EventType` enum (ai_credit, narration_neural_min,
  narration_generative_min, storage_gb_month, module_created).
- `record.ts` — append-only `recordUsage` (writes to `usage_events` via
  `withTenant` so RLS sees the tenant context).
- `aggregate.ts` — nightly aggregator: `usage_events` → `usage_daily`.
  Idempotent UPSERT keyed on `(tenant_id, user_id, day, event_type)`.
- `stripe-reporter.ts` — reports overages to Stripe via
  `subscriptionItems.createUsageRecord(action: "set")`. Idempotent on the
  reporting timestamp.

## Hard rule

NEVER reports PHI, module names, or user content to Stripe — only counts.
The Stripe call carries the SKU subscription-item ID and a numeric quantity.
