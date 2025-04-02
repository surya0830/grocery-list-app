# Infrastructure Quick Reference Guide

## Common Tasks

### 1. Deploy Infrastructure Changes

```bash
# Create a new branch
git checkout -b feature/infrastructure-change

# Make your changes
# ...

# Commit and push
git add .
git commit -m "feat: update infrastructure configuration"
git push origin feature/infrastructure-change

# Create a pull request
# Wait for validation and approval
```

### 2. Check Deployment Status

```bash
# View GitHub Actions runs
https://github.com/your-org/grocery-app/actions

# Check Azure resources
az group list --query "[?contains(name, 'grocery-app')].{Name:name,Location:location}" -o table
```

### 3. Monitor Costs

```bash
# View cost reports
az consumption usage list --start-date $(date -d "30 days ago" +%Y-%m-%d) --end-date $(date +%Y-%m-%d)

# Check resource utilization
az monitor metrics list --resource <resource-id> --metric "CpuPercentage" --interval PT1H
```

### 4. Security Checks

```bash
# Run tfsec locally
tfsec .

# Run Checkov locally
checkov -d .
```

## Environment URLs

- Development: https://grocery-app-dev.azurewebsites.net
- Production: https://grocery-app-prod.azurewebsites.net

## Important Commands

### Terraform Commands

```bash
# Initialize Terraform
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy resources
terraform destroy
```

### Azure CLI Commands

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "75231901-588d-441c-b96c-1d1c4787fc6b"

# List resource groups
az group list

# Get resource logs
az monitor activity-log list --resource-group grocery-app-prod
```

## Common Issues and Solutions

### 1. Deployment Failed

```bash
# Check GitHub Actions logs
# Verify Azure credentials
az account show

# Check resource quotas
az vm list-usage --location eastus
```

### 2. High Costs

```bash
# List all resources
az resource list --resource-group grocery-app-prod

# Check resource utilization
az monitor metrics list --resource <resource-id> --metric "CpuPercentage"
```

### 3. Security Alerts

```bash
# Run security scan
tfsec .

# Check compliance
checkov -d .
```

## Emergency Procedures

### 1. Rollback Deployment

```bash
# Revert to previous commit
git revert <commit-hash>

# Force push to main
git push origin main --force
```

### 2. Stop All Resources

```bash
# Stop all resources in resource group
az group delete --name grocery-app-prod --yes
```

### 3. Contact Support

- Emergency: infrastructure-emergency@yourdomain.com
- Phone: +1-XXX-XXX-XXXX
- Slack: #infrastructure-emergency

## Useful Links

- [Azure Portal](https://portal.azure.com)
- [GitHub Repository](https://github.com/your-org/grocery-app)
- [Terraform Documentation](https://www.terraform.io/docs)
- [Azure CLI Documentation](https://docs.microsoft.com/en-us/cli/azure) 