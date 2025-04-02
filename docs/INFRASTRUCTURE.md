# Infrastructure Deployment Guide

## Overview

This document describes the infrastructure deployment process for the Grocery App using Terraform and GitHub Actions. The infrastructure is deployed to Azure and includes both development and production environments.

## Prerequisites

Before you begin, ensure you have:

1. Azure CLI installed
2. Terraform installed (version 1.5.0 or later)
3. GitHub repository access
4. Required Azure permissions
5. Required GitHub repository secrets configured

## Repository Structure

```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
├── modules/
│   ├── database/
│   ├── webapp/
│   └── storage/
.github/
└── workflows/
    ├── infrastructure-deployment.yml
    ├── infrastructure-testing.yml
    └── infrastructure-cleanup.yml
```

## GitHub Secrets Configuration

The following secrets must be configured in your GitHub repository:

```bash
# Azure Authentication
ARM_SUBSCRIPTION_ID
ARM_TENANT_ID
ARM_CLIENT_ID
ARM_CLIENT_SECRET
AZURE_CREDENTIALS

# Application Secrets
JWT_SECRET
CURRENT_USER_OBJECT_ID

# Monitoring and Notifications
INFRACOST_API_KEY
SLACK_WEBHOOK_URL
PROD_APPROVERS
```

## Deployment Workflows

### 1. Infrastructure Deployment (`infrastructure-deployment.yml`)

This workflow manages the deployment of infrastructure changes:

- **Trigger**: Push to main branch or pull request
- **Stages**:
  1. Validate: Checks Terraform syntax and configuration
  2. Plan: Generates execution plan
  3. Deploy Dev: Automatically deploys to development
  4. Deploy Prod: Requires manual approval before production deployment

### 2. Infrastructure Testing (`infrastructure-testing.yml`)

This workflow performs security and compliance checks:

- **Trigger**: Push to main branch or pull request
- **Stages**:
  1. Security Scan: Runs tfsec for security analysis
  2. Compliance Check: Runs Checkov for compliance validation
  3. Cost Estimation: Estimates infrastructure costs using Infracost

### 3. Infrastructure Cleanup (`infrastructure-cleanup.yml`)

This workflow manages resource optimization:

- **Trigger**: Daily at midnight or manual trigger
- **Stages**:
  1. Cleanup: Identifies and marks unused resources
  2. Cost Optimization: Monitors resource utilization
  3. Notifications: Sends alerts via Slack

## Deployment Process

### Development Environment

1. Push changes to the main branch
2. GitHub Actions automatically:
   - Validates Terraform configuration
   - Plans infrastructure changes
   - Deploys to development environment
   - Runs security and compliance checks
   - Estimates costs

### Production Environment

1. Development deployment must succeed
2. Manual approval required from authorized users
3. Production deployment includes:
   - Additional security checks
   - Zero-downtime deployment
   - Health checks
   - Rollback capability

## Security Measures

- All secrets are stored in GitHub Secrets
- Production deployments require manual approval
- Security scanning with tfsec and Checkov
- Network security groups and private endpoints
- Regular security updates and patches

## Cost Optimization

- Daily cost monitoring and reporting
- Automatic cleanup of unused resources
- Resource utilization tracking
- Auto-scaling based on demand
- Cost estimation for all changes

## Monitoring and Alerts

- Application Insights integration
- Log Analytics workspace
- CPU and memory usage alerts
- Cost threshold alerts
- Slack notifications for important events

## Troubleshooting

### Common Issues

1. **Deployment Failure**
   - Check GitHub Actions logs
   - Verify Azure credentials
   - Check resource quotas

2. **Security Scan Failures**
   - Review tfsec and Checkov reports
   - Update security configurations
   - Contact security team if needed

3. **Cost Alerts**
   - Review resource utilization
   - Check for unused resources
   - Consider scaling down if appropriate

### Support

For infrastructure-related issues:
- Create an issue in the GitHub repository
- Tag with `infrastructure` label
- Include relevant logs and error messages

## Best Practices

1. **Version Control**
   - Always work in feature branches
   - Use meaningful commit messages
   - Keep Terraform state files secure

2. **Security**
   - Never commit secrets
   - Regular security scanning
   - Follow least privilege principle

3. **Cost Management**
   - Monitor resource utilization
   - Clean up unused resources
   - Use appropriate SKUs for each environment

4. **Documentation**
   - Keep this guide updated
   - Document all infrastructure changes
   - Maintain runbooks for common tasks

## Maintenance

### Regular Tasks

1. **Daily**
   - Review cost reports
   - Check for security alerts
   - Monitor resource utilization

2. **Weekly**
   - Review unused resources
   - Update security configurations
   - Check for infrastructure updates

3. **Monthly**
   - Review cost optimization
   - Update documentation
   - Perform security audits

## Contact

For infrastructure support:
- Email: infrastructure-support@yourdomain.com
- Slack: #infrastructure-support
- GitHub: @infrastructure-team 