variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure location where resources will be created"
  type        = string
}

variable "service_plan_name" {
  description = "The name of the App Service Plan"
  type        = string
}

variable "web_app_name" {
  description = "The name of the Web App"
  type        = string
}

variable "sku_name" {
  description = "The SKU name for the App Service Plan"
  type        = string
  default     = "B1"
}

variable "node_version" {
  description = "The Node.js version to use"
  type        = string
  default     = "18-lts"
}

variable "always_on" {
  description = "Whether to enable Always On for the Web App"
  type        = bool
  default     = false
}

variable "environment" {
  description = "The environment name (dev, staging, prod)"
  type        = string
}

variable "port" {
  description = "The port number for the Web App"
  type        = string
  default     = "8080"
}

variable "app_settings" {
  description = "Additional app settings for the Web App"
  type        = map(string)
  default     = {}
}

variable "key_vault_name" {
  description = "The name of the Key Vault"
  type        = string
}

variable "key_vault_uri" {
  description = "The URI of the Key Vault"
  type        = string
}

variable "tenant_id" {
  description = "The Azure AD tenant ID"
  type        = string
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

variable "db_connection_string" {
  description = "The connection string for the database"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
} 