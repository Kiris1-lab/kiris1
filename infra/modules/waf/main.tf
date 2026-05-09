/**
 * WAF module — DESIGN §12. OWASP top-10 managed rules + per-IP rate limit.
 * One WebACL per app target (marketing, app, api, admin) so blocks on
 * one surface don't bleed into the others.
 */

terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

variable "env" { type = string }
variable "tags" { type = map(string) }
variable "scope" {
  description = "REGIONAL for ALB/API GW, CLOUDFRONT for the marketing site distribution."
  type        = string
  default     = "REGIONAL"
}

resource "aws_wafv2_web_acl" "this" {
  name  = "kiris-${var.env}"
  scope = var.scope

  default_action { allow {} }

  # 1. AWS managed core rule set (OWASP top-10 baseline).
  rule {
    name     = "common"
    priority = 1
    override_action { none {} }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "common"
      sampled_requests_enabled   = true
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
  }

  # 2. Known-bad inputs.
  rule {
    name     = "knownbad"
    priority = 2
    override_action { none {} }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "knownbad"
      sampled_requests_enabled   = true
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }
  }

  # 3. SQLi managed rules.
  rule {
    name     = "sqli"
    priority = 3
    override_action { none {} }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "sqli"
      sampled_requests_enabled   = true
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }
  }

  # 4. Per-IP rate limit. 600/min lines up with the Fastify rate-limit plugin
  #    in apps/api. WAF is the outer gate; Fastify is the inner gate.
  rule {
    name     = "rate-limit"
    priority = 10
    action { block {} }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "rate-limit"
      sampled_requests_enabled   = true
    }
    statement {
      rate_based_statement {
        limit              = 6000  # 5-minute window in WAF
        aggregate_key_type = "IP"
      }
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "kiris-${var.env}"
    sampled_requests_enabled   = true
  }

  tags = var.tags
}

output "web_acl_arn" { value = aws_wafv2_web_acl.this.arn }
