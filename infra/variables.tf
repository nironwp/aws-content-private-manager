variable "bucket_name" {
  description = "The AWS bucket name, have to be unique"
  type        = string
}

variable "author" {
  description = "Author tag for the resources"
  type        = string
}

variable "region" {
  description = "Region where resources will be created"
  type        = string
}