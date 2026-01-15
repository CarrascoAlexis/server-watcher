# Build stage: compile dependencies with full build tools
FROM node:20-bookworm AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Runtime stage: slim production image
FROM node:20-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

# Copy built node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy source
COPY . .

# Ensure database dir exists inside container (mounted via compose)
RUN mkdir -p database

EXPOSE 3000
CMD ["node", "server.js"]
