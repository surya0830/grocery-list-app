#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Configure Azure App Service security
echo "Configuring Azure App Service security..."

# Enable HTTPS-only
az webapp update \
  --name $AZURE_APP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --https-only true

# Enable managed identity
az webapp identity assign \
  --name $AZURE_APP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP

# Configure network security group
az network nsg rule create \
  --resource-group $AZURE_RESOURCE_GROUP \
  --nsg-name $AZURE_NSG_NAME \
  --name AllowHTTPS \
  --priority 100 \
  --destination-port-ranges 443 \
  --protocol Tcp

# Configure Azure Storage security
echo "Configuring Azure Storage security..."

# Enable secure transfer
az storage account update \
  --name $AZURE_STORAGE_ACCOUNT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --enable-https-traffic-only true

# Configure CORS
az storage cors add \
  --account-name $AZURE_STORAGE_ACCOUNT \
  --services b \
  --methods GET POST PUT DELETE OPTIONS \
  --origins "https://$AZURE_APP_NAME.azurewebsites.net" \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 3600

# Configure Azure Key Vault
echo "Configuring Azure Key Vault..."

# Create Key Vault if it doesn't exist
az keyvault create \
  --name $AZURE_KEY_VAULT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $AZURE_LOCATION \
  --enabled-for-deployment true \
  --enabled-for-disk-encryption true \
  --enabled-for-template-deployment true \
  --sku standard

# Store secrets in Key Vault
az keyvault secret set \
  --vault-name $AZURE_KEY_VAULT \
  --name "StorageConnectionString" \
  --value $AZURE_STORAGE_CONNECTION_STRING

az keyvault secret set \
  --vault-name $AZURE_KEY_VAULT \
  --name "AppInsightsConnectionString" \
  --value $AZURE_APPINSIGHTS_CONNECTION_STRING

# Configure App Service to use Key Vault
az webapp config appsettings set \
  --name $AZURE_APP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --settings \
    "@Microsoft.KeyVault(SecretUri=https://$AZURE_KEY_VAULT.vault.azure.net/secrets/StorageConnectionString/)" \
    "@Microsoft.KeyVault(SecretUri=https://$AZURE_KEY_VAULT.vault.azure.net/secrets/AppInsightsConnectionString/)"

# Enable Azure Defender for App Service
az security pricing create \
  --name "AppServices" \
  --tier "Standard"

# Enable Azure Defender for Storage
az security pricing create \
  --name "StorageAccounts" \
  --tier "Standard"

echo "Azure security configuration completed successfully!" 