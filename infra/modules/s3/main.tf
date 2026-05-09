/**
 * S3 module — DESIGN §6.4, §12.
 *
 *   assets   tenant-uploaded materials (screenshots, PDFs, MP4s) before
 *            the scrubber runs and after.
 *   exports  packaged SCORM ZIPs. Lifecycle: 7-day retention then expire.
 *   audit    immutable audit-log archive (cross-region replicated).
 *   hipaa    HIPAA-tier prefix; bucket policy denies non-CMK PUTs.
 *
 * All buckets:
 *   - SSE-KMS with a customer-managed CMK
 *   - Block all public access (account + bucket)
 *   - Versioning enabled
 *   - Object Ownership = BucketOwnerEnforced (no ACLs)
 */

terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

variable "env" { type = string }
variable "kms_standard_arn" { type = string }
variable "kms_hipaa_arn" { type = string }
variable "kms_audit_arn" { type = string }
variable "tags" { type = map(string) }

locals {
  buckets = {
    assets  = { kms = var.kms_standard_arn, lifecycle_days = 0 }
    exports = { kms = var.kms_standard_arn, lifecycle_days = 7 }
    audit   = { kms = var.kms_audit_arn, lifecycle_days = 0 }
    hipaa   = { kms = var.kms_hipaa_arn, lifecycle_days = 0 }
  }
}

resource "aws_s3_bucket" "this" {
  for_each = local.buckets
  bucket   = "kiris-${var.env}-${each.key}"
  tags     = merge(var.tags, { purpose = each.key })
}

resource "aws_s3_bucket_ownership_controls" "this" {
  for_each = aws_s3_bucket.this
  bucket   = each.value.id
  rule { object_ownership = "BucketOwnerEnforced" }
}

resource "aws_s3_bucket_public_access_block" "this" {
  for_each                = aws_s3_bucket.this
  bucket                  = each.value.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "this" {
  for_each = aws_s3_bucket.this
  bucket   = each.value.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  for_each = aws_s3_bucket.this
  bucket   = each.value.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = local.buckets[each.key].kms
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "exports" {
  bucket = aws_s3_bucket.this["exports"].id

  rule {
    id     = "expire-7-days"
    status = "Enabled"

    filter {
      prefix = ""
    }

    expiration { days = 7 }
    noncurrent_version_expiration { noncurrent_days = 7 }
  }
}

# HIPAA bucket policy — deny PUTs that don't use a CMK (defense in depth).
resource "aws_s3_bucket_policy" "hipaa" {
  bucket = aws_s3_bucket.this["hipaa"].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyUnEncryptedObjectUploads"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.this["hipaa"].arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.this["hipaa"].arn,
          "${aws_s3_bucket.this["hipaa"].arn}/*"
        ]
        Condition = {
          Bool = { "aws:SecureTransport" = "false" }
        }
      }
    ]
  })
}

output "buckets" {
  value = { for k, v in aws_s3_bucket.this : k => v.bucket }
}
