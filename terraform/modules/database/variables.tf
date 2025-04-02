variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure location where resources will be created"
  type        = string
}

variable "cosmos_db_name" {
  description = "The name of the Cosmos DB account"
  type        = string
}

variable "cosmos_db_database_name" {
  description = "The name of the Cosmos DB database"
  type        = string
}

variable "enable_automatic_failover" {
  description = "Enable automatic failover for Cosmos DB"
  type        = bool
  default     = true
}

variable "consistency_level" {
  description = "The consistency level for Cosmos DB"
  type        = string
  default     = "BoundedStaleness"
}

variable "max_interval_in_seconds" {
  description = "The maximum interval in seconds for consistency"
  type        = number
  default     = 300
}

variable "max_staleness_prefix" {
  description = "The maximum staleness prefix for consistency"
  type        = number
  default     = 100000
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
} 