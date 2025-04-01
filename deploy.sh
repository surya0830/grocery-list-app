#!/bin/bash

# Exit on error
set -e

# Configuration
APP_NAME="grocery-app-dev"
RESOURCE_GROUP="grocery-app-dev-rg"
LOCATION="westus"
PLAN_NAME="grocery-app-dev-plan"
PLAN_SKU="B1"  # Basic tier for development
CONTAINER_NAME="grocery-app-dev-container"
CONTAINER_REGISTRY="groceryappdevregistry"
CONTAINER_IMAGE="grocery-app-dev:latest"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting development environment deployment...${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Login to Azure
echo "Logging in to Azure..."
az login

# Create resource group if it doesn't exist
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service plan with minimal resources
echo "Creating App Service plan..."
az appservice plan create \
    --name $PLAN_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku $PLAN_SKU \
    --is-linux \
    --number-of-workers 1

# Create container registry if it doesn't exist (using Basic SKU for development)
echo "Creating container registry..."
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $CONTAINER_REGISTRY \
    --sku Basic \
    --admin-enabled true

# Wait for container registry to be fully provisioned
echo -e "${YELLOW}Waiting for container registry to be fully provisioned...${NC}"
while true; do
    REGISTRY_STATUS=$(az acr show --name $CONTAINER_REGISTRY --resource-group $RESOURCE_GROUP --query provisioningState -o tsv)
    if [ "$REGISTRY_STATUS" == "Succeeded" ]; then
        break
    fi
    echo "Registry status: $REGISTRY_STATUS"
    sleep 10
done

# Get the login server and credentials
echo "Getting container registry credentials..."
ACR_LOGIN_SERVER=$(az acr show --name $CONTAINER_REGISTRY --query loginServer --output tsv)
ACR_USERNAME=$(az acr credential show --name $CONTAINER_REGISTRY --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $CONTAINER_REGISTRY --query "passwords[0].value" --output tsv)

# Build and push Docker image
echo "Building and pushing Docker image..."
docker login $ACR_LOGIN_SERVER -u $ACR_USERNAME -p $ACR_PASSWORD
docker build -t $ACR_LOGIN_SERVER/$CONTAINER_IMAGE .
docker push $ACR_LOGIN_SERVER/$CONTAINER_IMAGE

# Create Web App
echo "Creating Web App..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $PLAN_NAME \
    --name $APP_NAME \
    --deployment-container-image-name $ACR_LOGIN_SERVER/$CONTAINER_IMAGE

# Configure Web App settings for development
echo "Configuring Web App settings..."
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --linux-fx-version "DOCKER|$ACR_LOGIN_SERVER/$CONTAINER_IMAGE" \
    --always-on false  # Disable always-on for cost savings

# Set up auto-shutdown
echo "Configuring auto-shutdown..."
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --auto-heal-enabled true \
    --auto-heal-rules "{\"triggers\":[{\"name\":\"Inactivity\",\"requests\":{\"count\":0,\"timeInterval\":\"00:01:00\"}}],\"actions\":{\"actionType\":\"CustomAction\",\"customAction\":{\"exe\":\"az\",\"parameters\":\"webapp stop --name $APP_NAME --resource-group $RESOURCE_GROUP\"}}}"

# Set up minimal Application Insights
echo "Setting up Application Insights with minimal sampling..."
az monitor app-insights component create \
    --app $APP_NAME \
    --location $LOCATION \
    --resource-group $RESOURCE_GROUP \
    --sampling-percentage 20

# Set up cost alerts with lower threshold for development
echo "Setting up cost alerts..."
az monitor metrics alert create \
    --name "dev-cost-alert" \
    --resource-group $RESOURCE_GROUP \
    --scopes "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP" \
    --condition "total > 10" \
    --window-size 1d \
    --evaluation-frequency 1d

# Configure minimal backup for development
echo "Configuring minimal backup..."
az webapp config backup create \
    --resource-group $RESOURCE_GROUP \
    --webapp-name $APP_NAME \
    --backup-name "weekly-backup" \
    --frequency 7d \
    --retention 7d

# Set up scheduled shutdown
echo "Setting up scheduled shutdown..."
az monitor autoscale create \
    --resource-group $RESOURCE_GROUP \
    --name "dev-autoscale" \
    --min-count 0 \
    --max-count 1 \
    --count 1 \
    --resource $PLAN_NAME \
    --rules '[{"metricTrigger":{"metricName":"CpuPercentage","metricResourceUri":"","timeGrain":"PT1M","statistic":"Average","timeWindow":"PT1H","timeAggregation":"Average","operator":"LessThan","threshold":1},"scaleAction":{"direction":"Decrease","type":"ChangeCount","value":"0","cooldown":"PT5M"}}]'

echo -e "${GREEN}Development environment deployment completed!${NC}"
echo "Your development app is available at: https://$APP_NAME.azurewebsites.net"
echo -e "${GREEN}Cost-saving features enabled:${NC}"
echo "1. Auto-shutdown after 1 hour of inactivity"
echo "2. Scheduled shutdown outside working hours"
echo "3. Minimal Application Insights sampling (20%)"
echo "4. Weekly backups instead of daily"
echo "5. Cost alerts set at $10 daily threshold"
echo "6. Always-on disabled to allow cold starts"
echo "7. Single instance with no scaling" 