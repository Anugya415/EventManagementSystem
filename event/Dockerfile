# Use Node.js 18 Alpine as base image for smaller size
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Accept build argument
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application (skip linting for production build)
RUN npm run build

# Production stage
FROM node:18-alpine as production

# Set working directory
WORKDIR /app

# Copy built application from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/node_modules ./node_modules

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port 3000
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the Next.js application
CMD ["npm", "start"]
