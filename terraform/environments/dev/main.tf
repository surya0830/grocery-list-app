module "database" {
  source = "../../modules/database"

  resource_group_name      = var.resource_group_name
  location                 = var.location
  cosmos_db_name           = "${var.cosmos_db_name}-dev"
  cosmos_db_database_name  = "${var.cosmos_db_database_name}-dev"
  enable_automatic_failover = true
  consistency_level        = "BoundedStaleness"
  max_interval_in_seconds  = 300
  max_staleness_prefix     = 100000
  tags                     = var.tags
}

module "webapp" {
  source = "../../modules/webapp"

  resource_group_name     = var.resource_group_name
  location                = var.location
  service_plan_name       = "${var.service_plan_name}-dev"
  web_app_name            = "${var.web_app_name}-dev"
  sku_name                = "B1"
  node_version            = "18-lts"
  always_on               = false
  environment             = "dev"
  port                    = "8080"
  app_settings            = var.app_settings
  key_vault_name          = "${var.key_vault_name}-dev"
  key_vault_uri           = "https://${var.key_vault_name}-dev.vault.azure.net"
  tenant_id               = var.tenant_id
  current_user_object_id  = var.current_user_object_id
  jwt_secret              = var.jwt_secret
  db_connection_string    = module.database.cosmosdb_connection_string
  tags                    = var.tags
} 