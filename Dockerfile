FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

# Copy package files
COPY GroceryApp/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY GroceryApp/ .

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the server
CMD ["serve", "-s", ".", "-l", "3000"] 