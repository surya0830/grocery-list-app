resource "azurerm_service_plan" "grocery_app" {
  name                = "grocery-app-plan"
  location            = var.location
  resource_group_name = azurerm_resource_group.grocery_app.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "grocery_app" {
  name                = "grocery-app-dev"
  location            = var.location
  resource_group_name = azurerm_resource_group.grocery_app.name
  service_plan_id     = azurerm_service_plan.grocery_app.id

  site_config {
    application_stack {
      node_version = "18-lts"
    }
    always_on = false
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "~18"
    "NODE_ENV"                     = "production"
    "PORT"                         = "8080"
    "JWT_SECRET"                   = "@Microsoft.KeyVault(SecretUri=https://grocery-app-kv.vault.azure.net/secrets/jwt-secret)"
    "DB_CONNECTION_STRING"         = azurerm_cosmosdb_account.grocery_db.connection_strings[0]
  }

  identity {
    type = "SystemAssigned"
  }
}

# Key Vault for secrets
resource "azurerm_key_vault" "grocery_app" {
  name                = "grocery-app-kv"
  location            = var.location
  resource_group_name = azurerm_resource_group.grocery_app.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete"
    ]
  }

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_linux_web_app.grocery_app.identity[0].principal_id

    secret_permissions = [
      "Get",
      "List"
    ]
  }
}

resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "jwt-secret"
  value        = var.jwt_secret
  key_vault_id = azurerm_key_vault.grocery_app.id
}

data "azurerm_client_config" "current" {} 