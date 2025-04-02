# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies with legacy peer deps, skipping prepare script
RUN npm ci --only=production --legacy-peer-deps --ignore-scripts

# Copy built assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/server ./src/server

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "server"] 