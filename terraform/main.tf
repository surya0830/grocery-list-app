provider "azurerm" {
  features {}
  subscription_id = "75231901-588d-441c-b96c-1d1c4787fc6b"
}

resource "azurerm_resource_group" "grocery_app" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.grocery_app.name
  location            = azurerm_resource_group.grocery_app.location
  sku                 = "Standard"
  admin_enabled       = true
}

resource "azurerm_storage_account" "grocery_storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.grocery_app.name
  location                 = azurerm_resource_group.grocery_app.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "pantry_images" {
  name                  = var.storage_container_name
  storage_account_name  = azurerm_storage_account.grocery_storage.name
  container_access_type = "private"
}

resource "azurerm_kubernetes_cluster" "grocery_aks" {
  name                = var.aks_cluster_name
  location            = azurerm_resource_group.grocery_app.location
  resource_group_name = azurerm_resource_group.grocery_app.name
  dns_prefix          = "groceryapp"

  default_node_pool {
    name       = "default"
    node_count = var.aks_node_count
    vm_size    = var.aks_node_size
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Production"
  }
}

# Grant AKS access to ACR
resource "azurerm_role_assignment" "aks_acr" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.grocery_aks.kubelet_identity[0].object_id
}

output "kube_config" {
  value     = azurerm_kubernetes_cluster.grocery_aks.kube_config_raw
  sensitive = true
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  value     = azurerm_container_registry.acr.admin_username
  sensitive = true
}

output "acr_admin_password" {
  value     = azurerm_container_registry.acr.admin_password
  sensitive = true
}

output "storage_account_name" {
  value = azurerm_storage_account.grocery_storage.name
}

output "storage_account_key" {
  value     = azurerm_storage_account.grocery_storage.primary_access_key
  sensitive = true
}

output "storage_container_name" {
  value = azurerm_storage_container.pantry_images.name
} 