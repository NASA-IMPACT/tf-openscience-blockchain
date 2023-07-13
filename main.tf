
module "managed_blockchain" {
  source                    = "https://github.com/NASA-IMPACT/tf_aws_managed_blockchain/releases/download/v1.1.9/tf_aws_managed_blockchain.zip"
  ec2_cli_configuration     = var.ec2_cli_configuration
  member_admin_password     = var.member_admin_password
  member_admin_username     = var.member_admin_username
  member_name               = "m${var.prefix}"
  network_name              = "n${var.prefix}"
  prefix                    = var.prefix
  bc_peer_node_count        = 2
  ami_id                    = var.ami_id
  s3_uri_bc_code            = var.s3_uri_bc_code
  ecs_container_folder_path = "${path.module}/os-blockchain-api"
  storage_bucket            = var.storage_bucket
  ecs-cluster-name          = var.prefix
  ecs_domain_name           = var.ecs_domain_name
  peernode_instance_type    = var.peernode_instance_type
  ecs_environment = [
    { name = "BUCKETNAME", value = var.storage_bucket },
    { name = "APP_CLIENT_ID", value = var.app_client_id },
    { name = "USER_POOL_ID", value = var.user_pool_id },
    { name = "MCP_ROLE", value = var.mcp_role },
    { name = "ROLE_ARN", value = var.role_arn }
  ]
}
