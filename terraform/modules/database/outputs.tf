output "cosmosdb_account_name" {
  description = "The name of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.name
}

output "cosmosdb_database_name" {
  description = "The name of the Cosmos DB database"
  value       = azurerm_cosmosdb_mongo_database.main.name
}

output "cosmosdb_connection_string" {
  description = "The connection string for the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.connection_strings[0]
  sensitive   = true
}

output "cosmosdb_endpoint" {
  description = "The endpoint of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.endpoint
} 