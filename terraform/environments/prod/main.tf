module "database" {
  source = "../../modules/database"

  resource_group_name      = var.resource_group_name
  location                 = var.location
  cosmos_db_name           = var.cosmos_db_name
  cosmos_db_database_name  = var.cosmos_db_database_name
  enable_automatic_failover = true
  consistency_level        = "Strong"  # Strong consistency for production
  max_interval_in_seconds  = 300
  max_staleness_prefix     = 100000
  enable_private_endpoint   = true     # Enable private endpoint for Cosmos DB
  tags                     = var.tags
}

# Network Security Group for Web App
resource "azurerm_network_security_group" "webapp" {
  name                = "${var.web_app_name}-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name

  security_rule {
    name                       = "AllowHTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowHTTPS"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = var.tags
}

module "webapp" {
  source = "../../modules/webapp"

  resource_group_name     = var.resource_group_name
  location                = var.location
  service_plan_name       = var.service_plan_name
  web_app_name            = var.web_app_name
  sku_name                = "P1v2"  # Production-grade SKU
  node_version            = "18-lts"
  always_on               = true    # Always On enabled for production
  environment             = "production"
  port                    = "8080"
  app_settings            = merge(var.app_settings, {
    "WEBSITE_NODE_DEFAULT_VERSION" = "~18"
    "NODE_ENV"                     = "production"
    "PORT"                         = "8080"
    "ENABLE_LOGGING"              = "true"
    "ENABLE_METRICS"              = "true"
  })
  key_vault_name          = var.key_vault_name
  key_vault_uri           = "https://${var.key_vault_name}.vault.azure.net"
  tenant_id               = var.tenant_id
  current_user_object_id  = var.current_user_object_id
  jwt_secret              = var.jwt_secret
  db_connection_string    = module.database.cosmosdb_connection_string
  network_security_group_id = azurerm_network_security_group.webapp.id
  tags                    = var.tags
}

# Auto-scaling rules for the App Service Plan
resource "azurerm_monitor_autoscale_setting" "webapp" {
  name                = "${var.web_app_name}-autoscale"
  resource_group_name = var.resource_group_name
  location            = var.location
  target_resource_id  = module.webapp.app_service_plan_id

  profile {
    name = "defaultProfile"

    capacity {
      default = 2
      minimum = 2
      maximum = 10
    }

    rule {
      metric_trigger {
        metric_name        = "CpuPercentage"
        metric_resource_id = module.webapp.app_service_plan_id
        time_grain         = "PT1M"
        statistic          = "Average"
        time_window        = "PT5M"
        time_aggregation   = "Average"
        operator           = "GreaterThan"
        threshold          = 70
      }

      scale_action {
        direction = "Increase"
        type      = "ChangeCount"
        value     = "1"
        cooldown  = "PT5M"
      }
    }

    rule {
      metric_trigger {
        metric_name        = "CpuPercentage"
        metric_resource_id = module.webapp.app_service_plan_id
        time_grain         = "PT1M"
        statistic          = "Average"
        time_window        = "PT5M"
        time_aggregation   = "Average"
        operator           = "LessThan"
        threshold          = 30
      }

      scale_action {
        direction = "Decrease"
        type      = "ChangeCount"
        value     = "1"
        cooldown  = "PT5M"
      }
    }
  }

  notification {
    email {
      send_to_subscription_administrator    = true
      send_to_subscription_co_administrator = true
    }
  }
}

# Application Insights for monitoring
resource "azurerm_application_insights" "main" {
  name                = "${var.web_app_name}-insights"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = "web"
  retention_in_days   = 90

  tags = var.tags
}

# Diagnostic settings for the Web App
resource "azurerm_monitor_diagnostic_setting" "webapp" {
  name                       = "${var.web_app_name}-diagnostics"
  target_resource_id         = module.webapp.web_app_id
  log_analytics_workspace_id = var.log_analytics_workspace_id

  log {
    category = "AppServiceHTTPLogs"
    enabled  = true

    retention_policy {
      enabled = true
      days    = 90
    }
  }

  log {
    category = "AppServiceConsoleLogs"
    enabled  = true

    retention_policy {
      enabled = true
      days    = 90
    }
  }

  metric {
    category = "AllMetrics"
    enabled  = true

    retention_policy {
      enabled = true
      days    = 90
    }
  }
}

# Alert rules for monitoring
resource "azurerm_monitor_metric_alert" "cpu_alert" {
  name                = "${var.web_app_name}-cpu-alert"
  resource_group_name = var.resource_group_name
  scopes              = [module.webapp.app_service_plan_id]
  description         = "Alert when CPU usage is high"
  severity            = 2

  criteria {
    metric_namespace = "Microsoft.Web/serverfarms"
    metric_name      = "CpuPercentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = var.action_group_id
  }
}

resource "azurerm_monitor_metric_alert" "memory_alert" {
  name                = "${var.web_app_name}-memory-alert"
  resource_group_name = var.resource_group_name
  scopes              = [module.webapp.app_service_plan_id]
  description         = "Alert when memory usage is high"
  severity            = 2

  criteria {
    metric_namespace = "Microsoft.Web/serverfarms"
    metric_name      = "MemoryPercentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = var.action_group_id
  }
} 