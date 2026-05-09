/**
 * Cognito module — DESIGN §6.5. Customer auth user pool.
 *
 * MFA optional on Standard tier; required for HIPAA editors. Enforcement
 * lives in the API: `apps/api/src/plugins/auth.ts` checks the JWT's
 * `custom:tier` claim and rejects HIPAA editors without MFA.
 */

terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

variable "env" { type = string }
variable "tags" { type = map(string) }

resource "aws_cognito_user_pool" "this" {
  name = "kiris-${var.env}"

  password_policy {
    minimum_length    = 12
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
  }

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  mfa_configuration = "OPTIONAL"

  software_token_mfa_configuration {
    enabled = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    name                     = "tenant_id"
    attribute_data_type      = "String"
    mutable                  = true
    string_attribute_constraints { min_length = 36, max_length = 36 }
  }
  schema {
    name                     = "tier"
    attribute_data_type      = "String"
    mutable                  = true
    string_attribute_constraints { min_length = 4, max_length = 16 }
  }
  schema {
    name                     = "role"
    attribute_data_type      = "String"
    mutable                  = true
    string_attribute_constraints { min_length = 4, max_length = 32 }
  }

  tags = var.tags
}

resource "aws_cognito_user_pool_client" "app" {
  name         = "kiris-${var.env}-app"
  user_pool_id = aws_cognito_user_pool.this.id

  generate_secret                      = false
  prevent_user_existence_errors        = "ENABLED"
  enable_token_revocation              = true
  refresh_token_validity               = 30
  access_token_validity                = 60
  id_token_validity                    = 60
  token_validity_units {
    refresh_token = "days"
    access_token  = "minutes"
    id_token      = "minutes"
  }

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

output "user_pool_id" { value = aws_cognito_user_pool.this.id }
output "user_pool_arn" { value = aws_cognito_user_pool.this.arn }
output "client_id" { value = aws_cognito_user_pool_client.app.id }
