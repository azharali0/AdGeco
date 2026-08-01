output "vpc_id"{value=aws_vpc.main.id}
output "database_endpoint"{value=aws_db_instance.postgres.address}
output "redis_endpoint"{value=aws_elasticache_replication_group.redis.primary_endpoint_address}
output "asset_bucket"{value=aws_s3_bucket.assets.id}
output "asset_cdn"{value=aws_cloudfront_distribution.assets.domain_name}
output "api_repository"{value=aws_ecr_repository.api.repository_url}
output "worker_repository"{value=aws_ecr_repository.worker.repository_url}
output "database_password"{value=random_password.database.result;sensitive=true}
