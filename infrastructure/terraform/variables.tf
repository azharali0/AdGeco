variable "environment" {type=string;validation{condition=contains(["development","staging","production"],var.environment);error_message="environment must be development, staging or production"}}
variable "region" {type=string;default="eu-west-2"}
variable "vpc_cidr" {type=string;default="10.40.0.0/16"}
variable "database_instance_class" {type=string;default="db.t4g.medium"}
variable "redis_node_type" {type=string;default="cache.t4g.small"}
variable "domain_name" {type=string;default=""}
