#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Create resource group
echo "Creating resource group..."
az group create \
  --name $AZURE_RESOURCE_GROUP \
  --location $AZURE_LOCATION

# Create storage account with secure transfer enabled
echo "Creating storage account..."
az storage account create \
  --name $AZURE_STORAGE_ACCOUNT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $AZURE_LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --https-only true \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false

# Get storage account key
STORAGE_KEY=$(az storage account keys list \
  --account-name $AZURE_STORAGE_ACCOUNT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --query "[0].value" -o tsv)

# Create storage container
echo "Creating storage container..."
az storage container create \
  --name "images" \
  --account-name $AZURE_STORAGE_ACCOUNT \
  --account-key $STORAGE_KEY \
  --public-access off

# Create Key Vault
echo "Creating Key Vault..."
az keyvault create \
  --name $AZURE_KEY_VAULT \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $AZURE_LOCATION \
  --enabled-for-deployment true \
  --enabled-for-disk-encryption true \
  --enabled-for-template-deployment true \
  --sku standard

# Get current user object ID
CURRENT_USER_ID=$(az ad signed-in-user show --query id -o tsv)

# Grant current user access to Key Vault
echo "Granting current user access to Key Vault..."
az role assignment create \
  --assignee $CURRENT_USER_ID \
  --role "Key Vault Administrator" \
  --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$AZURE_RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$AZURE_KEY_VAULT"

# Wait for role assignment to propagate
echo "Waiting for role assignment to propagate..."
sleep 30

# Store secrets in Key Vault
echo "Storing secrets in Key Vault..."
az keyvault secret set \
  --vault-name $AZURE_KEY_VAULT \
  --name "StorageConnectionString" \
  --value "DefaultEndpointsProtocol=https;AccountName=$AZURE_STORAGE_ACCOUNT;AccountKey=$STORAGE_KEY;EndpointSuffix=core.windows.net"

# Create App Service plan
echo "Creating App Service plan..."
az appservice plan create \
  --name "$AZURE_APP_NAME-plan" \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $AZURE_LOCATION \
  --sku B1 \
  --is-linux

# Create App Service
echo "Creating App Service..."
az webapp create \
  --name $AZURE_APP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --plan "$AZURE_APP_NAME-plan" \
  --runtime "NODE:18-lts"

# Enable managed identity
echo "Enabling managed identity..."
az webapp identity assign \
  --name $AZURE_APP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP

# Get managed identity principal ID
PRINCIPAL_ID=$(az webapp identity show \
  --name $AZURE_APP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --query "principalId" -o tsv)

# Grant Key Vault access to managed identity
echo "Granting Key Vault access to managed identity..."
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role "Key Vault Secrets User" \
  --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$AZURE_RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$AZURE_KEY_VAULT"

# Configure App Service settings
echo "Configuring App Service settings..."
az webapp config appsettings set \
  --name $AZURE_APP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --settings \
    "@Microsoft.KeyVault(SecretUri=https://$AZURE_KEY_VAULT.vault.azure.net/secrets/StorageConnectionString/)" \
    "WEBSITE_NODE_DEFAULT_VERSION=~18" \
    "WEBSITE_RUN_FROM_PACKAGE=1"

# Enable HTTPS-only
echo "Enabling HTTPS-only..."
az webapp update \
  --name $AZURE_APP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --https-only true

# Create network security group
echo "Creating network security group..."
az network nsg create \
  --name $AZURE_NSG_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --location $AZURE_LOCATION

# Add HTTPS rule to NSG
echo "Adding HTTPS rule to NSG..."
az network nsg rule create \
  --resource-group $AZURE_RESOURCE_GROUP \
  --nsg-name $AZURE_NSG_NAME \
  --name AllowHTTPS \
  --priority 100 \
  --destination-port-ranges 443 \
  --protocol Tcp

# Enable Azure Defender for App Service
echo "Enabling Azure Defender for App Service..."
az security pricing create \
  --name "AppServices" \
  --tier "Standard"

# Enable Azure Defender for Storage
echo "Enabling Azure Defender for Storage..."
az security pricing create \
  --name "StorageAccounts" \
  --tier "Standard"

echo "Azure setup completed successfully!" 