variable "ec2_cli_configuration" {
  type = list(object({
    key_pair_name = string
    channel_id = string
    channel_codename = string
    instance_type = string

  }))
  default = [
    {
      channel_id="amchannel2"
      channel_codename = "amch2"
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



variable "prefix" {}
variable "vpc_id" {}
variable "subnet_id" {}

variable "ami_id" {
  default = "ami-0434d5878c6ad6d4c"
}

variable "bc_peer_node_count" {
  default = 1
}