resource "azurerm_cosmosdb_account" "grocery_db" {
  name                = "grocery-app-db"
  location            = var.location
  resource_group_name = azurerm_resource_group.grocery_app.name
  offer_type          = "Standard"
  kind                = "MongoDB"

  enable_automatic_failover = true

  capabilities {
    name = "EnableMongo"
  }

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_mongo_database" "grocery_db" {
  name                = "grocery-db"
  resource_group_name = azurerm_resource_group.grocery_app.name
  account_name        = azurerm_cosmosdb_account.grocery_db.name
}

output "cosmosdb_connection_string" {
  value     = azurerm_cosmosdb_account.grocery_db.connection_strings[0]
  sensitive = true
} 