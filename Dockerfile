FROM ghcr.io/puppeteer/puppeteer:24.3.0

USER root

# Install utilities
RUN apt-get update && apt-get install -y \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/src/server.js"]
