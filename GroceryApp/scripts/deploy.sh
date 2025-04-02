#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "❌ .env file not found"
    exit 1
fi

# Check required environment variables
required_vars=(
    "AZURE_APP_NAME"
    "AZURE_RESOURCE_GROUP"
    "AZURE_LOCATION"
    "AZURE_STORAGE_ACCOUNT"
    "AZURE_STORAGE_CONNECTION_STRING"
    "AZURE_KEY_VAULT"
    "GITHUB_REPO_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

# Create resource group if it doesn't exist
echo "📦 Creating resource group if it doesn't exist..."
az group create --name $AZURE_RESOURCE_GROUP --location $AZURE_LOCATION

# Create App Service plan
echo "📦 Creating App Service plan..."
az appservice plan create \
    --name "${AZURE_APP_NAME}-plan" \
    --resource-group $AZURE_RESOURCE_GROUP \
    --location $AZURE_LOCATION \
    --sku B1 \
    --is-linux

# Create Web App
echo "📦 Creating Web App..."
az webapp create \
    --resource-group $AZURE_RESOURCE_GROUP \
    --plan "${AZURE_APP_NAME}-plan" \
    --name $AZURE_APP_NAME \
    --runtime "NODE:18-lts" \
    --deployment-source-url $GITHUB_REPO_URL \
    --deployment-source-branch main

# Configure app settings
echo "⚙️ Configuring app settings..."
az webapp config appsettings set \
    --resource-group $AZURE_RESOURCE_GROUP \
    --name $AZURE_APP_NAME \
    --settings \
    AZURE_STORAGE_CONNECTION_STRING="$AZURE_STORAGE_CONNECTION_STRING" \
    AZURE_STORAGE_ACCOUNT="$AZURE_STORAGE_ACCOUNT" \
    AZURE_KEY_VAULT="$AZURE_KEY_VAULT" \
    NODE_ENV="production" \
    APPLICATIONINSIGHTS_CONNECTION_STRING="$AZURE_APPINSIGHTS_CONNECTION_STRING"

# Enable HTTPS only
echo "🔒 Enabling HTTPS only..."
az webapp update \
    --name $AZURE_APP_NAME \
    --resource-group $AZURE_RESOURCE_GROUP \
    --https-only true

# Assign managed identity
echo "🔑 Assigning managed identity..."
az webapp identity assign \
    --name $AZURE_APP_NAME \
    --resource-group $AZURE_RESOURCE_GROUP

# Get the managed identity
MANAGED_IDENTITY=$(az webapp identity show \
    --name $AZURE_APP_NAME \
    --resource-group $AZURE_RESOURCE_GROUP \
    --query principalId \
    --output tsv)

# Grant Key Vault access to managed identity using RBAC
echo "🔑 Granting Key Vault access to managed identity..."
az role assignment create \
    --assignee $MANAGED_IDENTITY \
    --role "Key Vault Secrets User" \
    --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$AZURE_RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$AZURE_KEY_VAULT"

# Configure CORS
echo "🌐 Configuring CORS..."
az webapp cors add \
    --resource-group $AZURE_RESOURCE_GROUP \
    --name $AZURE_APP_NAME \
    --allowed-origins "*"

# Enable Application Insights
echo "📊 Enabling Application Insights..."
az webapp monitor applicationinsights connect \
    --app $AZURE_APP_NAME \
    --resource-group $AZURE_RESOURCE_GROUP \
    --app-insights grocery-app-dev-ai

# Get the app URL
APP_URL=$(az webapp show \
    --name $AZURE_APP_NAME \
    --resource-group $AZURE_RESOURCE_GROUP \
    --query defaultHostName \
    --output tsv)

echo "✅ Deployment completed successfully!"
echo "🌐 App URL: https://$APP_URL"
echo "📝 Next steps:"
echo "1. Update your mobile app's API_URL to https://$APP_URL"
echo "2. Test the deployed application"
echo "3. Monitor the application using Application Insights" 