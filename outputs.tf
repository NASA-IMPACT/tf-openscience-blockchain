output "ec2_cli_ips" {
  value = module.managed_blockchain.bc_ec2_ip
}

output "service_endpoint" {
  value = module.managed_blockchain.bc_sevice_endpoint
}

output "framework_version" {
  value = module.managed_blockchain.bc_framework_version
}
