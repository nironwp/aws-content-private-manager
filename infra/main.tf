terraform {

  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.56.0"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      owner      = var.author
      managed-by = "terraform"
    }
  }
}
