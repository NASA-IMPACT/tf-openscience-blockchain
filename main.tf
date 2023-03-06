
module "managed_blockchain" {
  source = "https://github.com/amarouane-ABDELHAK/tf_aws_managed_blockchain/releases/download/v1.0.4/tf_aws_managed_blockchain.zip"
  ec2_cli_configuration = var.ec2_cli_configuration
  member_admin_password = var.member_admin_password
  member_admin_username = var.member_admin_username
  member_name = "m${var.prefix}"
  network_name = "n${var.prefix}"
  prefix = var.prefix
  bc_peer_node_count = max(var.bc_peer_node_count, length(var.ec2_cli_configuration))
  subnet_id = var.subnet_id
  vpc_id = var.vpc_id
  ami_id = var.ami_id
}

