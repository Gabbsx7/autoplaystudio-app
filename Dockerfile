# Use Node.js 18 Alpine
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY apps/web/package*.json ./
COPY apps/web/pnpm-lock.yaml ./

# Install dependencies
RUN npm ci --only=production --ignore-scripts

# Copy source code
COPY apps/web ./

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
USER nextjs

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "server.js"] 