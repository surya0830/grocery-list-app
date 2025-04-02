resource "azurerm_service_plan" "main" {
  name                = var.service_plan_name
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = var.sku_name

  tags = var.tags
}

resource "azurerm_linux_web_app" "main" {
  name                = var.web_app_name
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    application_stack {
      node_version = var.node_version
    }
    always_on = var.always_on
  }

  app_settings = merge(
    var.app_settings,
    {
      "WEBSITE_NODE_DEFAULT_VERSION" = var.node_version
      "NODE_ENV"                     = var.environment
      "PORT"                         = var.port
      "JWT_SECRET"                   = "@Microsoft.KeyVault(SecretUri=${var.key_vault_uri}/secrets/jwt-secret)"
      "DB_CONNECTION_STRING"         = var.db_connection_string
    }
  )

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

resource "azurerm_key_vault" "main" {
  name                = var.key_vault_name
  location            = var.location
  resource_group_name = var.resource_group_name
  tenant_id           = var.tenant_id
  sku_name            = "standard"

  access_policy {
    tenant_id = var.tenant_id
    object_id = var.current_user_object_id

    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete"
    ]
  }

  access_policy {
    tenant_id = var.tenant_id
    object_id = azurerm_linux_web_app.main.identity[0].principal_id

    secret_permissions = [
      "Get",
      "List"
    ]
  }

  tags = var.tags
}

resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "jwt-secret"
  value        = var.jwt_secret
  key_vault_id = azurerm_key_vault.main.id
} 