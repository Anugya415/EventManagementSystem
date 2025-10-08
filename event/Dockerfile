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

# Build the Next.js application
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

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
