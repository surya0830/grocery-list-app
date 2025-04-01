# Grocery List Application

A full-stack grocery list application with a React Native mobile app (GroceryApp) and Node.js backend (server).

## Project Structure

- `GroceryApp/`: React Native mobile application (Expo)
- `server/`: Express.js backend API
- `terraform/`: Infrastructure as code for deployment

## Setup Instructions

### Backend (server)

```bash
cd server
npm install
npm run build
npm run dev   # For development
```

### Mobile App (GroceryApp)

```bash
cd GroceryApp
npm install
npm start     # Starts Expo development server
```

### Infrastructure (Terraform)

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Environment Variables

- Create `.env` files in both `server/` and `GroceryApp/` directories
- See `.env.example` files for required variables

## Technologies

- **Frontend**: React Native, Expo, Redux Toolkit
- **Backend**: Node.js, Express, MongoDB
- **Infrastructure**: Terraform, AWS
