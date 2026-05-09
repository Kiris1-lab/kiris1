/**
 * KMS module — DESIGN §6.4. Customer-managed CMKs for envelope encryption.
 *
 *   standard      Used by RDS, S3 standard buckets, Secrets Manager.
 *   audit         Separate CMK for audit log streams (cross-account audit).
 *   hipaa_default Default CMK for the HIPAA bucket prefix; per-tenant CMKs
 *                 are minted by the API when a customer upgrades.
 */

terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

variable "env" { type = string }
variable "tags" { type = map(string) }

resource "aws_kms_key" "standard" {
  description             = "Kiris standard tenant data + at-rest encryption (${var.env})"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  tags                    = merge(var.tags, { tier = "standard" })
}

resource "aws_kms_alias" "standard" {
  name          = "alias/kiris-${var.env}-standard"
  target_key_id = aws_kms_key.standard.key_id
}

resource "aws_kms_key" "audit" {
  description             = "Kiris audit log encryption (${var.env})"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  tags                    = merge(var.tags, { purpose = "audit" })
}

resource "aws_kms_alias" "audit" {
  name          = "alias/kiris-${var.env}-audit"
  target_key_id = aws_kms_key.audit.key_id
}

resource "aws_kms_key" "hipaa_default" {
  description             = "Default CMK for HIPAA tier prefix (${var.env}). Per-tenant CMKs minted by the API on upgrade."
  enable_key_rotation     = true
  deletion_window_in_days = 30
  tags                    = merge(var.tags, { tier = "hipaa" })
}

resource "aws_kms_alias" "hipaa_default" {
  name          = "alias/kiris-${var.env}-hipaa"
  target_key_id = aws_kms_key.hipaa_default.key_id
}

output "standard_arn" { value = aws_kms_key.standard.arn }
output "audit_arn" { value = aws_kms_key.audit.arn }
output "hipaa_default_arn" { value = aws_kms_key.hipaa_default.arn }
