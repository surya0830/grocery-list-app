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
  default     = "grocery-app-dev"
}

variable "location" {
  description = "The Azure location where resources will be created"
  type        = string
  default     = "East US"
}

variable "cosmos_db_name" {
  description = "The name of the Cosmos DB account"
  type        = string
  default     = "grocery-app-db"
}

variable "cosmos_db_database_name" {
  description = "The name of the Cosmos DB database"
  type        = string
  default     = "grocery-db"
}

variable "service_plan_name" {
  description = "The name of the App Service Plan"
  type        = string
  default     = "grocery-app-plan"
}

variable "web_app_name" {
  description = "The name of the Web App"
  type        = string
  default     = "grocery-app"
}

variable "key_vault_name" {
  description = "The name of the Key Vault"
  type        = string
  default     = "grocery-app-kv"
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

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "Development"
    Project     = "Grocery App"
    ManagedBy   = "Terraform"
  }
} 