locals {name="adgeco-${var.environment}";azs=slice(data.aws_availability_zones.available.names,0,2)}
data "aws_availability_zones" "available" {state="available"}
resource "random_password" "database" {length=32;special=true}
resource "aws_vpc" "main" {cidr_block=var.vpc_cidr;enable_dns_support=true;enable_dns_hostnames=true;tags={Name=local.name}}
resource "aws_subnet" "private" {count=2;vpc_id=aws_vpc.main.id;availability_zone=local.azs[count.index];cidr_block=cidrsubnet(var.vpc_cidr,4,count.index);tags={Name="${local.name}-private-${count.index}"}}
resource "aws_db_subnet_group" "main" {name=local.name;subnet_ids=aws_subnet.private[*].id}
resource "aws_security_group" "data" {name="${local.name}-data";vpc_id=aws_vpc.main.id;egress{from_port=0;to_port=0;protocol="-1";cidr_blocks=["0.0.0.0/0"]}}
resource "aws_db_instance" "postgres" {identifier="${local.name}-postgres";engine="postgres";engine_version="16.3";instance_class=var.database_instance_class;allocated_storage=100;max_allocated_storage=1000;storage_encrypted=true;db_name="adgeco";username="adgeco";password=random_password.database.result;db_subnet_group_name=aws_db_subnet_group.main.name;vpc_security_group_ids=[aws_security_group.data.id];multi_az=var.environment=="production";backup_retention_period=var.environment=="production"?30:7;deletion_protection=var.environment=="production";skip_final_snapshot=var.environment!="production";performance_insights_enabled=true}
resource "aws_elasticache_subnet_group" "main" {name=local.name;subnet_ids=aws_subnet.private[*].id}
resource "aws_elasticache_replication_group" "redis" {replication_group_id="${local.name}-redis";description="AdGeco queues and cache";node_type=var.redis_node_type;port=6379;subnet_group_name=aws_elasticache_subnet_group.main.name;security_group_ids=[aws_security_group.data.id];at_rest_encryption_enabled=true;transit_encryption_enabled=true;automatic_failover_enabled=var.environment=="production";num_cache_clusters=var.environment=="production"?2:1}
resource "aws_s3_bucket" "assets" {bucket="${local.name}-creative-assets";force_destroy=var.environment!="production"}
resource "aws_s3_bucket_versioning" "assets" {bucket=aws_s3_bucket.assets.id;versioning_configuration{status="Enabled"}}
resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {bucket=aws_s3_bucket.assets.id;rule{apply_server_side_encryption_by_default{sse_algorithm="AES256"}}}
resource "aws_s3_bucket_public_access_block" "assets" {bucket=aws_s3_bucket.assets.id;block_public_acls=true;block_public_policy=true;ignore_public_acls=true;restrict_public_buckets=true}
resource "aws_cloudfront_origin_access_control" "assets" {name="${local.name}-assets";origin_access_control_origin_type="s3";signing_behavior="always";signing_protocol="sigv4"}
resource "aws_cloudfront_distribution" "assets" {enabled=true;is_ipv6_enabled=true;origin{domain_name=aws_s3_bucket.assets.bucket_regional_domain_name;origin_id="assets";origin_access_control_id=aws_cloudfront_origin_access_control.assets.id}default_cache_behavior{allowed_methods=["GET","HEAD","OPTIONS"];cached_methods=["GET","HEAD"];target_origin_id="assets";viewer_protocol_policy="redirect-to-https";forwarded_values{query_string=false;cookies{forward="none"}}}restrictions{geo_restriction{restriction_type="none"}}viewer_certificate{cloudfront_default_certificate=true}}
resource "aws_ecr_repository" "api" {name="${local.name}/api";image_scanning_configuration{scan_on_push=true};encryption_configuration{encryption_type="AES256"}}
resource "aws_ecr_repository" "worker" {name="${local.name}/worker";image_scanning_configuration{scan_on_push=true};encryption_configuration{encryption_type="AES256"}}
resource "aws_cloudwatch_log_group" "platform" {name="/${local.name}/platform";retention_in_days=var.environment=="production"?90:14}


resource "aws_kms_key" "platform" { description = "AdGeco platform encryption"; enable_key_rotation = true }
resource "aws_secretsmanager_secret" "runtime" { name = "${local.name}/runtime"; kms_key_id = aws_kms_key.platform.arn }
resource "aws_s3_bucket_lifecycle_configuration" "assets" { bucket = aws_s3_bucket.assets.id; rule { id="abort-incomplete"; status="Enabled"; abort_incomplete_multipart_upload { days_after_initiation = 7 } } }
resource "aws_wafv2_web_acl" "edge" { name="${local.name}-edge"; scope="CLOUDFRONT"; default_action { allow {} } visibility_config { cloudwatch_metrics_enabled=true; metric_name="${local.name}-edge"; sampled_requests_enabled=true } rule { name="aws-common"; priority=1; override_action { none {} } statement { managed_rule_group_statement { name="AWSManagedRulesCommonRuleSet"; vendor_name="AWS" } } visibility_config { cloudwatch_metrics_enabled=true; metric_name="aws-common"; sampled_requests_enabled=true } } }
