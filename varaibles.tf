variable "ec2_cli_configuration" {
  type = list(object({
    key_pair_name = string
    channel_id = string
    channel_codename = string
    instance_type = string

  }))
  default = [
    {
      channel_id="amchannel"
      channel_codename = "amch"
      key_pair_name = "amarouane"
      instance_type = "t2.medium"
    }
  ]
}

variable "member_admin_username" {
  description = "The user name of your member's admin user."
}
variable "member_admin_password" {
  description = "The password of your member's admin user."
}

variable "member_name" {
  type = string
  default = "mmarouane"
}

variable "network_name" {
  type = string
  default = "nmarouane"
}
variable "prefix" {}
variable "vpc_id" {}
variable "subnet_id" {}

variable "ami_id" {
  default = "ami-0434d5878c6ad6d4c"
}