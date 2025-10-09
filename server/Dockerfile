# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 express

# Copy built application
COPY --from=builder --chown=express:nodejs /app/dist ./dist
COPY --from=deps --chown=express:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=express:nodejs /app/package.json ./package.json

# Switch to non-root user
USER express

# Expose port (Railway will set PORT environment variable)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
