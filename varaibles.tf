variable "ec2_cli_configuration" {
  type = list(object({
    key_pair_name    = string
    channel_id       = string
    channel_codename = string
    instance_type    = string

  }))
  default = [
    {
      channel_id       = "osbcdevchannel"
      channel_codename = "devch"
      key_pair_name    = null
      instance_type    = "t2.medium"
    },
    {
      channel_id       = "sonewch"
      channel_codename = "devnch"
      key_pair_name    = null
      instance_type    = "t2.medium"
    }

  ]
}
variable "member_admin_username" {
  description = "The user name of your member's admin user."
}
variable "member_admin_password" {
  description = "The password of your member's admin user."
}
variable "ami_id" {
  default = "ami-087de15a22879b9ef"
}
variable "bc_peer_node_count" {
  default = 1
}
variable "s3_uri_bc_code" {
  default = "s3://bc-chaincode-package/final.tar.gz"
}
variable "peernode_instance_type" {
  description = "The type of compute instance to use for your peer nodes."
  default     = "bc.t3.small"
}
variable "ecs_domain_name" {
  description = "Hosted zone name"
}
variable "prefix" {}
variable "storage_bucket" {}
variable "app_client_id" {}
variable "user_pool_id" {}
variable "mcp_role" {}
variable "role_arn" {}
variable "auth_type" {}
variable "user_data_s3_uri" {}
