# Pre-launch AWS cost-savings notes

We're pre-launch with zero customers. This document records the right-sizing
decisions made to bring fixed AWS spend down while preserving every HIPAA-
relevant control. Every change has a TODO that must be reverted before the
first paying customer or, where noted, before signing any BAA.

## Untouched (HIPAA / compliance constraints)

These are listed first to make it explicit what was NOT changed:

- KMS encryption on RDS and S3 (`storage_encrypted`, `kms_key_id`,
  bucket SSE-KMS)
- `deletion_protection = true` on RDS
- `backup_retention_period = 35` on RDS
- `rds.force_ssl = 1` parameter
- RLS policies in `packages/db/src/rls.ts`
- WAF rule sets in `infra/modules/waf`
- Audit log retention: admin = 2555 days, api = 365 days
- All Phase 2 / HIPAA tier code paths (HIPAA bucket policy, hipaa-tier
  KMS CMK, HIPAA RLS gate, BAA upgrade flow)

## Changes

| # | Where | Change | Approx monthly savings |
|---|-------|--------|------------------------|
| 1 | `infra/envs/prod/main.tf` | RDS `instance_class` `db.r6g.large` → `db.t4g.medium` | ~$120 |
| 2 | `infra/modules/rds/main.tf` | `allocated_storage` 100 → 20, `max_allocated_storage` 1000 → 200 (storage autoscaling still grows on demand) | ~$10 |
| 3 | `infra/modules/rds/main.tf` | Read replica gated behind `enable_read_replica` (default `false`); not enabled in prod | ~$30 (a t4g.medium replica) |
| 4 | `infra/modules/rds/main.tf` | `multi_az = true` → `false` | ~$30 (doubles instance + storage cost) |
| 5 | `infra/modules/network/main.tf` | NAT Gateway count 2 → 1 (each AZ's private RT now points at the single NAT) | ~$32 + a chunk of data-processing |
| 6 | `infra/modules/rds/main.tf` | Performance Insights retention left at default 7 days (free tier on t4g/t3) — no code change needed; verified the field is unset | $0 (already free) |
| 7 | `infra/modules/cloudwatch/main.tf` | Marketing log group retention 90 → 30 days. Audit log groups untouched | ~$1–$3 |

## Before / after

Rough numbers for the always-on AWS line items in `us-east-1`:

| Line item | Before | After |
|-----------|--------|-------|
| RDS instance | $180 (db.r6g.large multi-AZ) | $30 (db.t4g.medium single-AZ) |
| RDS read replica | $90 (db.r6g.large) | $0 (disabled) |
| RDS storage 100 GB | ~$11.50 | ~$2.30 (20 GB) |
| NAT Gateway × 2 | ~$64 + data | ~$32 + data |
| CloudWatch logs | ~$2 | ~$1 |
| **Total fixed** | **~$300–$450/mo** | **~$80–$120/mo** |

Variable spend (S3, Polly, Comprehend Medical, Anthropic) is unaffected and
scales with use, which is near-zero pre-launch.

## TODOs to revert before first paying customer

Each of these is also marked as a `TODO` comment in the code at the
relevant line:

1. **`infra/envs/prod/main.tf`** — bump `instance_class` back to
   `db.r6g.large`; buy 1-yr RI through the AWS console at that point.
2. **`infra/envs/prod/main.tf`** — pass `enable_read_replica = true` to
   `module.rds` once the admin console has real query load.
3. **`infra/modules/rds/main.tf`** — set `multi_az = true`. **Required
   before signing any BAA**, not just before first customer.
4. **`infra/modules/network/main.tf`** — restore NAT count to
   `length(var.public_subnet_cidrs)` and per-AZ routing
   (`aws_nat_gateway.this[count.index]`). Required for AZ-failure HA.

`infra/modules/rds/main.tf`'s `allocated_storage` does not need a manual
revert — autoscaling will grow it. The marketing log retention can stay
at 30 days indefinitely.

## When to buy Reserved Instances

**Wait at least one week of confirmed steady state before purchasing
1-yr RIs.** RIs are non-refundable. Pre-launch traffic patterns aren't
representative of post-launch — sizing decisions change. The RI commitment
should follow the customer, not precede them.

When ready, buy through the AWS console (no Terraform-level RI
management; pricing is account-wide) for:

- The RDS instance class chosen at that point (likely `db.r6g.large` or
  `db.r6g.xlarge`)
- Region `us-east-1`
- 1-year, no upfront, standard RI

## Cross-reference

- DESIGN §6.4 (encryption, backups) — unchanged.
- DESIGN §6.5 (access control, RLS) — unchanged.
- DESIGN §6.6 (audit retention) — unchanged.
- DESIGN §15.6 (admin console reads from replica) — temporarily unmet;
  admin console reads from the writer pre-launch. Restore via the
  `enable_read_replica` flag once admin has real load.
