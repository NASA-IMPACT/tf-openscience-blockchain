
module "managed_blockchain" {
  source = "/Users/abdelhakmarouane/workstation/github/tf_aws_managed_blockchain_all"
  ec2_cli_configuration = var.ec2_cli_configuration
  member_admin_password = var.member_admin_password
  member_admin_username = var.member_admin_username
  member_name = "m${var.prefix}"
  network_name = "n${var.prefix}"
  prefix = var.prefix
  bc_peer_node_count = 2
  ami_id = var.ami_id
  s3_uri_bc_code = var.s3_uri_bc_code
  ecs_container_folder_path = "/Users/abdelhakmarouane/workstation/github/tf_aws_managed_blockchain_all/application/os-blockchain-api/sync-api"
  storage_bucket            = var.storage_bucket
  ecs-cluster-name = var.prefix
  ecs_domain_name = var.ecs_domain_name
  peernode_instance_type = var.peernode_instance_type
  ecs_environment = [

        { name = "BUCKETNAME", value = var.storage_bucket },
        { name = "APP_CLIENT_ID", value = var.app_client_id  },
        { name = "USER_POOL_ID", value = var.user_pool_id  },

      ]
}
