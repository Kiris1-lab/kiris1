/**
 * Network module — VPC with public + private + DB subnet tiers across
 * two AZs, NAT gateway per AZ for private egress.
 *
 * Security groups exposed:
 *   - app_sg     attached to ECS / Lambda for the API + customer app
 *   - admin_sg   attached to ECS / Lambda for the admin console (stricter)
 *   - db_sg      attached to RDS; only app_sg + admin_sg can reach it
 */

terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

variable "env" { type = string }
variable "vpc_cidr" { type = string }
variable "public_subnet_cidrs" { type = list(string) }
variable "private_subnet_cidrs" { type = list(string) }
variable "db_subnet_cidrs" { type = list(string) }
variable "office_cidrs" { type = list(string) }
variable "tags" { type = map(string) }

data "aws_availability_zones" "this" { state = "available" }

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = merge(var.tags, { Name = "kiris-${var.env}" })
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = var.tags
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.this.names[count.index]
  map_public_ip_on_launch = true
  tags                    = merge(var.tags, { Name = "kiris-${var.env}-public-${count.index}" })
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.this.names[count.index]
  tags              = merge(var.tags, { Name = "kiris-${var.env}-private-${count.index}" })
}

resource "aws_subnet" "db" {
  count             = length(var.db_subnet_cidrs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.db_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.this.names[count.index]
  tags              = merge(var.tags, { Name = "kiris-${var.env}-db-${count.index}" })
}

// Single NAT pre-launch for cost. TODO: restore one-per-AZ before first
// paying customer for HA. With one NAT, an outage in its AZ takes down
// private-subnet egress for both AZs.
resource "aws_eip" "nat" {
  count  = 1
  domain = "vpc"
  tags   = var.tags
}

resource "aws_nat_gateway" "this" {
  count         = 1
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id
  tags          = var.tags
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
  tags = merge(var.tags, { Name = "kiris-${var.env}-public-rt" })
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  count  = length(aws_subnet.private)
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    // All AZs egress through the single NAT pre-launch. Each AZ keeps its
    // own RT so restoring one-per-AZ later is just a count change above.
    nat_gateway_id = aws_nat_gateway.this[0].id
  }
  tags = merge(var.tags, { Name = "kiris-${var.env}-private-${count.index}-rt" })
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# --- Security groups ---

resource "aws_security_group" "app" {
  name        = "kiris-${var.env}-app"
  description = "Customer app + API"
  vpc_id      = aws_vpc.this.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

resource "aws_security_group" "admin" {
  name        = "kiris-${var.env}-admin"
  description = "Internal admin console — restricted ingress"
  vpc_id      = aws_vpc.this.id

  # Inbound only from the office CIDRs (HTTPS).
  dynamic "ingress" {
    for_each = var.office_cidrs
    content {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

resource "aws_security_group" "db" {
  name        = "kiris-${var.env}-db"
  description = "RDS Postgres — only the app + admin SGs can reach it"
  vpc_id      = aws_vpc.this.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id, aws_security_group.admin.id]
  }

  tags = var.tags
}

output "vpc_id" { value = aws_vpc.this.id }
output "private_subnet_ids" { value = aws_subnet.private[*].id }
output "db_subnet_ids" { value = aws_subnet.db[*].id }
output "app_sg_id" { value = aws_security_group.app.id }
output "admin_sg_id" { value = aws_security_group.admin.id }
output "db_sg_id" { value = aws_security_group.db.id }
