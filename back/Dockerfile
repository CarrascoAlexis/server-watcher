# Use Debian-based Node image to support better-sqlite3 prebuilt binaries
FROM node:18-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

# Install production deps first
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Copy source
COPY . .

# Ensure database dir exists inside container (mounted via compose)
RUN mkdir -p database

EXPOSE 3000
CMD ["node", "server.js"]
