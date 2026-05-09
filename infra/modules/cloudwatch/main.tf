/**
 * CloudWatch module — log groups, metric filters, and alarms.
 *
 * Hard rule: no PHI in logs. Metric filters here count audit events
 * (PHI-scrubber blocks, dunning failures, 5xx surges) by reference and
 * never extract values.
 */

terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

variable "env" { type = string }
variable "kms_key_arn" { type = string }
variable "tags" { type = map(string) }

resource "aws_cloudwatch_log_group" "api" {
  name              = "/kiris/${var.env}/api"
  retention_in_days = 365 # Standard tier; HIPAA tier consumers cross-replicate to a 6-yr archive.
  kms_key_id        = var.kms_key_arn
  tags              = var.tags
}

resource "aws_cloudwatch_log_group" "admin" {
  name              = "/kiris/${var.env}/admin"
  retention_in_days = 2555 # 7 years for internal admin actions
  kms_key_id        = var.kms_key_arn
  tags              = var.tags
}

resource "aws_cloudwatch_log_group" "marketing" {
  name              = "/kiris/${var.env}/marketing"
  retention_in_days = 90
  kms_key_id        = var.kms_key_arn
  tags              = var.tags
}

# --- Metric filters ---

resource "aws_cloudwatch_log_metric_filter" "phi_scrubber_blocks" {
  name           = "kiris-${var.env}-phi-blocks"
  log_group_name = aws_cloudwatch_log_group.api.name
  pattern        = "{ $.action = \"scrubber.text\" && $.decision = \"block\" }"

  metric_transformation {
    name      = "PhiScrubberBlocks"
    namespace = "Kiris/${var.env}"
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "api_5xx" {
  name           = "kiris-${var.env}-api-5xx"
  log_group_name = aws_cloudwatch_log_group.api.name
  pattern        = "{ $.statusCode >= 500 }"

  metric_transformation {
    name      = "Api5xx"
    namespace = "Kiris/${var.env}"
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "stripe_webhook_failures" {
  name           = "kiris-${var.env}-stripe-webhook-fail"
  log_group_name = aws_cloudwatch_log_group.api.name
  pattern        = "{ $.action = \"stripe.webhook\" && $.success = false }"

  metric_transformation {
    name      = "StripeWebhookFailures"
    namespace = "Kiris/${var.env}"
    value     = "1"
  }
}

# --- Alarms ---

resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "kiris-${var.env}-api-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Api5xx"
  namespace           = "Kiris/${var.env}"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "API 5xx surge"
  treat_missing_data  = "notBreaching"
  tags                = var.tags
}

output "log_group_api" { value = aws_cloudwatch_log_group.api.name }
output "log_group_admin" { value = aws_cloudwatch_log_group.admin.name }
