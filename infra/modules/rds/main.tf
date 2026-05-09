/**
 * RDS module — Postgres 16, customer-managed KMS, automated backups,
 * read replica for the admin console.
 *
 * DESIGN §6.4 / §6.5: storage_encrypted + KMS CMK; backup_retention 35 d;
 * deletion_protection on; force_ssl=1 in the parameter group.
 */

terraform {
  required_providers {
    aws    = { source = "hashicorp/aws" }
    random = { source = "hashicorp/random" }
  }
}

variable "env" { type = string }
variable "subnet_ids" { type = list(string) }
variable "db_sg_id" { type = string }
variable "kms_key_arn" { type = string }
variable "instance_class" { type = string }
variable "tags" { type = map(string) }

resource "random_password" "master" {
  length           = 32
  special          = true
  override_special = "_-"
}

resource "aws_db_subnet_group" "this" {
  name       = "kiris-${var.env}-db"
  subnet_ids = var.subnet_ids
  tags       = var.tags
}

resource "aws_db_parameter_group" "this" {
  name   = "kiris-${var.env}-pg16"
  family = "postgres16"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  # RLS will be applied by @kiris/db's apply-rls.ts; this parameter group
  # ensures we'll never accept a non-TLS connection.

  tags = var.tags
}

resource "aws_db_instance" "writer" {
  identifier                  = "kiris-${var.env}"
  engine                      = "postgres"
  engine_version              = "16.4"
  instance_class              = var.instance_class
  allocated_storage           = 100
  max_allocated_storage       = 1000
  storage_encrypted           = true
  kms_key_id                  = var.kms_key_arn
  db_name                     = "kiris"
  username                    = "kiris_master"
  password                    = random_password.master.result
  parameter_group_name        = aws_db_parameter_group.this.name
  db_subnet_group_name        = aws_db_subnet_group.this.name
  vpc_security_group_ids      = [var.db_sg_id]
  multi_az                    = true
  backup_retention_period     = 35
  backup_window               = "07:00-08:00"
  maintenance_window          = "Sun:08:00-Sun:09:00"
  deletion_protection         = true
  skip_final_snapshot         = false
  final_snapshot_identifier   = "kiris-${var.env}-final"
  performance_insights_enabled = true
  performance_insights_kms_key_id = var.kms_key_arn
  enabled_cloudwatch_logs_exports = ["postgresql"]
  publicly_accessible         = false
  tags                        = var.tags
}

resource "aws_db_instance" "reader" {
  identifier                  = "kiris-${var.env}-reader"
  replicate_source_db         = aws_db_instance.writer.identifier
  instance_class              = var.instance_class
  publicly_accessible         = false
  performance_insights_enabled = true
  storage_encrypted           = true
  kms_key_id                  = var.kms_key_arn
  tags                        = merge(var.tags, { role = "reader" })
}

# Master credentials live in Secrets Manager; the app role rotates via IAM.
resource "aws_secretsmanager_secret" "master" {
  name       = "kiris/${var.env}/db/master"
  kms_key_id = var.kms_key_arn
  tags       = var.tags
}

resource "aws_secretsmanager_secret_version" "master" {
  secret_id = aws_secretsmanager_secret.master.id
  secret_string = jsonencode({
    username = aws_db_instance.writer.username
    password = random_password.master.result
    host     = aws_db_instance.writer.address
    port     = aws_db_instance.writer.port
    dbname   = aws_db_instance.writer.db_name
  })
}

output "writer_endpoint" { value = aws_db_instance.writer.endpoint }
output "reader_endpoint" { value = aws_db_instance.reader.endpoint }
output "master_secret_arn" { value = aws_secretsmanager_secret.master.arn }
