variable "ec2_cli_configuration" {
  type = list(object({
    key_pair_name = string
    channel_id = string
    channel_codename = string
    instance_type = string

  }))
  default = [
    {
      channel_id="osbcdevchannel"
      channel_codename = "devch"
      key_pair_name = "os_bc_shared_dev"
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
  default = "ami-087de15a22879b9ef" #"ami-0434d5878c6ad6d4c"
}

variable "bc_peer_node_count" {
  default = 1
}

variable "s3_uri_bc_code" {
  default = "s3://bc-chaincode-package/final.tar.gz"
}

variable "storage_bucket" {

}