variable "env" {
  description = "Environment name (dev, prod)."
  type        = string
}

variable "region" {
  description = "AWS region. us-east-1 in production."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.20.0.0/24", "10.20.1.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.20.10.0/24", "10.20.11.0/24"]
}

variable "db_subnet_cidrs" {
  type    = list(string)
  default = ["10.20.20.0/24", "10.20.21.0/24"]
}

variable "office_cidrs" {
  description = "Office + on-call VPN CIDRs allowed to reach the admin app."
  type        = list(string)
  default     = []
}

variable "tags" {
  type    = map(string)
  default = { project = "kiris", owner = "ops@kiris.ai" }
}
