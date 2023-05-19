


module "managed_blockchain" {
  source = "https://github.com/NASA-IMPACT/tf_aws_managed_blockchain/releases/download/v1.1.2/tf_aws_managed_blockchain.zip"
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

  s3_uri_bc_code = var.s3_uri_bc_code

  docker_file_path          = "./os-blockchain-api/Dockerfile"
  ecs_container_folder_path = "./os-blockchain-api"
  storage_bucket            = var.storage_bucket
}
