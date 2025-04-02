FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Install MongoDB
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - \
    && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list \
    && apt-get update \
    && apt-get install -y mongodb-org \
    && mkdir -p /data/db

# Install global npm packages
RUN npm install -g npm@latest typescript ts-node nodemon

# Start MongoDB service
CMD ["mongod", "--dbpath", "/data/db"] 