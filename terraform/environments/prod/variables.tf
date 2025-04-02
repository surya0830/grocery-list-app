variable "subscription_id" {
  description = "The Azure subscription ID"
  type        = string
}

variable "tenant_id" {
  description = "The Azure AD tenant ID"
  type        = string
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "grocery-app-prod"
}

variable "location" {
  description = "The Azure location where resources will be created"
  type        = string
  default     = "East US"
}

variable "cosmos_db_name" {
  description = "The name of the Cosmos DB account"
  type        = string
  default     = "grocery-app-db-prod"
}

variable "cosmos_db_database_name" {
  description = "The name of the Cosmos DB database"
  type        = string
  default     = "grocery-db-prod"
}

variable "service_plan_name" {
  description = "The name of the App Service Plan"
  type        = string
  default     = "grocery-app-plan-prod"
}

variable "web_app_name" {
  description = "The name of the Web App"
  type        = string
  default     = "grocery-app-prod"
}

variable "key_vault_name" {
  description = "The name of the Key Vault"
  type        = string
  default     = "grocery-app-kv-prod"
}

variable "current_user_object_id" {
  description = "The object ID of the current user"
  type        = string
}

variable "jwt_secret" {
  description = "The JWT secret for authentication"
  type        = string
  sensitive   = true
}

variable "app_settings" {
  description = "Additional app settings for the Web App"
  type        = map(string)
  default     = {}
}

variable "log_analytics_workspace_id" {
  description = "The ID of the Log Analytics workspace for diagnostics"
  type        = string
}

variable "action_group_id" {
  description = "The ID of the action group for alerts"
  type        = string
}

variable "auto_scaling_min_instances" {
  description = "Minimum number of instances for auto-scaling"
  type        = number
  default     = 2
}

variable "auto_scaling_max_instances" {
  description = "Maximum number of instances for auto-scaling"
  type        = number
  default     = 10
}

variable "auto_scaling_cpu_threshold" {
  description = "CPU threshold percentage for auto-scaling"
  type        = number
  default     = 70
}

variable "auto_scaling_memory_threshold" {
  description = "Memory threshold percentage for auto-scaling"
  type        = number
  default     = 80
}

variable "alert_cpu_threshold" {
  description = "CPU threshold percentage for alerts"
  type        = number
  default     = 80
}

variable "alert_memory_threshold" {
  description = "Memory threshold percentage for alerts"
  type        = number
  default     = 80
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "Production"
    Project     = "Grocery App"
    ManagedBy   = "Terraform"
    Criticality = "High"
  }
} 