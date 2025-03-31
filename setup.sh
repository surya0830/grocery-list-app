#!/bin/bash

# Setup script for Grocery App project

# Functions
setup_test_db() {
  echo "Setting up test database..."
  # Check if MongoDB is running
  if ! mongosh --eval "db.serverStatus()" > /dev/null 2>&1; then
    echo "MongoDB is not running. Please start MongoDB first."
    exit 1
  fi

  # Create test database
  mongosh --eval "db = db.getSiblingDB('groceryapp_test'); db.createCollection('users');"
  echo "Test database setup complete."
}

setup_server() {
  echo "Setting up server..."
  cd server
  npm install
  if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from example. Please update with your actual values."
  fi
  if [ ! -f .env.test ]; then
    cp .env.example .env.test
    echo "Created .env.test file from example. Please update with your actual test values."
  fi
  npm run build
  cd ..
  echo "Server setup complete."
}

setup_app() {
  echo "Setting up mobile app..."
  cd GroceryApp
  npm install
  if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from example. Please update with your actual values."
  fi
  cd ..
  echo "Mobile app setup complete."
}

clean_project() {
  echo "Cleaning project..."
  # Remove build artifacts
  rm -rf server/dist
  # Remove node_modules
  rm -rf server/node_modules GroceryApp/node_modules
  # Remove OS specific files
  find . -name ".DS_Store" -type f -delete
  # Remove test coverage reports
  rm -rf server/coverage GroceryApp/coverage
  echo "Project cleaned."
}

run_tests() {
  echo "Running tests..."
  # Setup test database first
  setup_test_db
  
  # Run server tests
  cd server
  npm test
  cd ..
  
  # Run mobile app tests
  cd GroceryApp
  npm test
  cd ..
  echo "Tests completed."
}

# Main script
case "$1" in
  server)
    setup_server
    ;;
  app)
    setup_app
    ;;
  all)
    setup_server
    setup_app
    ;;
  clean)
    clean_project
    ;;
  test)
    run_tests
    ;;
  *)
    echo "Usage: $0 {server|app|all|clean|test}"
    echo "  server: Setup server only"
    echo "  app: Setup mobile app only"
    echo "  all: Setup both server and app"
    echo "  clean: Clean project (remove build artifacts and dependencies)"
    echo "  test: Run tests for both server and app"
    exit 1
esac

exit 0 