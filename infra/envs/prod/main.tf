/**
 * Production composition. Apply from CI only.
 *
 *   cd infra/envs/prod
 *   terraform init
 *   terraform plan -out=tfplan
 *   terraform apply tfplan
 */

terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.70" }
  }

  # Remote state lives in an S3 bucket + DynamoDB lock table that's
  # provisioned out-of-band (chicken-and-egg). Configure via
  #   terraform init -backend-config=backend.hcl
  backend "s3" {}
}

provider "aws" {
  region = var.region
  default_tags { tags = var.tags }
}

variable "env" { default = "prod" }
variable "region" { default = "us-east-1" }
variable "office_cidrs" { type = list(string) }
variable "tags" { default = { project = "kiris", env = "prod" } }

module "network" {
  source               = "../../modules/network"
  env                  = var.env
  vpc_cidr             = "10.20.0.0/16"
  public_subnet_cidrs  = ["10.20.0.0/24", "10.20.1.0/24"]
  private_subnet_cidrs = ["10.20.10.0/24", "10.20.11.0/24"]
  db_subnet_cidrs      = ["10.20.20.0/24", "10.20.21.0/24"]
  office_cidrs         = var.office_cidrs
  tags                 = var.tags
}

module "kms" {
  source = "../../modules/kms"
  env    = var.env
  tags   = var.tags
}

module "rds" {
  source      = "../../modules/rds"
  env         = var.env
  subnet_ids  = module.network.db_subnet_ids
  db_sg_id    = module.network.db_sg_id
  kms_key_arn = module.kms.standard_arn
  // TODO: bump to db.r6g.large before first paying customer; buy 1-yr RI at that point.
  instance_class = "db.t4g.medium"
  // TODO: set enable_read_replica = true once admin console has real query load.
  tags = var.tags
}

module "s3" {
  source           = "../../modules/s3"
  env              = var.env
  kms_standard_arn = module.kms.standard_arn
  kms_hipaa_arn    = module.kms.hipaa_default_arn
  kms_audit_arn    = module.kms.audit_arn
  tags             = var.tags
}

module "cognito" {
  source = "../../modules/cognito"
  env    = var.env
  tags   = var.tags
}

module "cloudwatch" {
  source      = "../../modules/cloudwatch"
  env         = var.env
  kms_key_arn = module.kms.audit_arn
  tags        = var.tags
}

module "waf_app" {
  source = "../../modules/waf"
  env    = "${var.env}-app"
  tags   = var.tags
}

module "waf_admin" {
  source = "../../modules/waf"
  env    = "${var.env}-admin"
  tags   = var.tags
}

# --- Outputs (consumed by app deploy + secrets-manager seeding) ---

output "rds_writer_endpoint" { value = module.rds.writer_endpoint }
output "rds_reader_endpoint" { value = module.rds.reader_endpoint }
output "rds_master_secret_arn" { value = module.rds.master_secret_arn }
output "cognito_user_pool_id" { value = module.cognito.user_pool_id }
output "cognito_client_id" { value = module.cognito.client_id }
output "s3_buckets" { value = module.s3.buckets }
output "kms_standard_arn" { value = module.kms.standard_arn }
output "kms_hipaa_default_arn" { value = module.kms.hipaa_default_arn }
output "cloudwatch_log_group_api" { value = module.cloudwatch.log_group_api }
output "cloudwatch_log_group_admin" { value = module.cloudwatch.log_group_admin }
