output "web_app_name" {
  description = "The name of the Web App"
  value       = azurerm_linux_web_app.main.name
}

output "web_app_url" {
  description = "The URL of the Web App"
  value       = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "web_app_identity" {
  description = "The managed identity of the Web App"
  value       = azurerm_linux_web_app.main.identity[0].principal_id
}

output "key_vault_id" {
  description = "The ID of the Key Vault"
  value       = azurerm_key_vault.main.id
}

output "key_vault_uri" {
  description = "The URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
} 