variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "grocery-app-resources"
}

variable "location" {
  description = "The Azure location where resources will be created"
  type        = string
  default     = "East US"
}

variable "acr_name" {
  description = "The name of the Azure Container Registry"
  type        = string
  default     = "groceryappregistry"
}

variable "storage_account_name" {
  description = "The name of the storage account"
  type        = string
  default     = "groceryappstorage"
}

variable "storage_container_name" {
  description = "The name of the storage container for pantry images"
  type        = string
  default     = "pantry-images"
}

variable "aks_cluster_name" {
  description = "The name of the AKS cluster"
  type        = string
  default     = "grocery-aks"
}

variable "aks_node_count" {
  description = "The number of nodes in the AKS cluster"
  type        = number
  default     = 2
}

variable "aks_node_size" {
  description = "The size of the AKS nodes"
  type        = string
  default     = "Standard_DS2_v2"
}

variable "jwt_secret" {
  description = "The JWT secret for authentication"
  type        = string
  sensitive   = true
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