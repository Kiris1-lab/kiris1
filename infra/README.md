# Kiris infrastructure

Terraform modules + environment compositions for the Kiris AWS footprint.
Implements DESIGN §4 (architecture), §6.4 (encryption), §6.5 (access),
§6.10 (internal staff access), §12 (security checklist).

## Layout

```
infra/
  versions.tf            required providers, version pins
  variables.tf           shared input variables
  modules/
    network/             VPC, subnets, NAT, route tables, base SGs
    kms/                 customer-managed CMKs (Standard + HIPAA-tenant)
    rds/                 Postgres 16 + read replica + KMS + backups + RLS-ready params
    s3/                  asset / export / backup / hipaa buckets, KMS, lifecycle, no public ACLs
    cognito/             customer auth user pool + app clients
    cloudwatch/          log groups, metric filters, alarms (PHI-scrubber blocks, 5xx, dunning)
    waf/                 OWASP top-10 managed rules + per-IP rate limit
  envs/
    prod/                production composition
    dev/                 developer sandbox composition
```

## Hard rules (DESIGN §6, §12)

- **No PHI in CloudWatch logs.** Log groups are configured with metric
  filters that match counts of PHI-scrubber events but never the values.
- **All state is encrypted.** RDS uses a customer-managed KMS CMK; S3
  buckets each have a CMK; backups inherit the same CMK.
- **No public S3 ACLs.** Public access blocks are enforced at both account
  and bucket level.
- **Tenant isolation in DB via RLS.** The `rds` module sets
  `rds.force_ssl = 1` and creates the `kiris_app` and `kiris_readreplica`
  roles with grants only against the tables they need.
- **HIPAA tier infrastructure is segregated.** A separate KMS CMK per
  HIPAA tenant is provisioned by the API (Step 4 hook); the `s3` module
  reserves the `hipaa/` prefix and a separate bucket policy.
- **Internal admin perimeter is stricter.** A separate VPC SG + WAF rule
  set restricts `admin.kiris.ai` to the office CIDR + on-call VPN.

## Apply (production)

```bash
cd envs/prod
terraform init
terraform plan -out=tfplan        # review carefully
terraform apply tfplan
```

Pin module versions and lock the provider via `versions.tf`. Never apply
from a developer laptop in production — use the CI pipeline + assumed role.

## Outputs (consumed by apps)

The `prod` composition emits:

- `rds_writer_endpoint`, `rds_reader_endpoint`
- `cognito_user_pool_id`, `cognito_client_id`
- `s3_assets_bucket`, `s3_exports_bucket`
- `kms_standard_cmk_arn`
- `cloudwatch_log_group_api`, `cloudwatch_log_group_admin`

These map to the env vars in the root `.env.example`.
