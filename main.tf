

module "managed_blockchain" {
  source = "https://github.com/amarouane-ABDELHAK/tf_aws_managed_blockchain/releases/download/v1.0.2/tf_aws_managed_blockchain.zip"
  ec2_cli_configuration = var.ec2_cli_configuration
  member_admin_password = var.member_admin_password
  member_admin_username = var.member_admin_username
  member_name = var.member_name
  network_name = var.network_name
  prefix = var.prefix
  subnet_id = var.subnet_id
  vpc_id = var.vpc_id
  ami_id = var.ami_id
}

