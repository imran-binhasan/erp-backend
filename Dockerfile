# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first (layer caching)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY tsconfig.json .
COPY src/ src/

# Build
RUN npm run build

# ---- Production Stage ----
FROM node:22-alpine AS production

WORKDIR /app

# Copy production deps
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/core/server.js"]
