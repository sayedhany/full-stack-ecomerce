# Use the official Node.js 20 Alpine image for smaller size
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --production

# Copy the rest of the application code
COPY . .

# Create uploads directory and set permissions
RUN mkdir -p server/uploads && chmod 755 server/uploads

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ecommerce -u 1001 -G nodejs

# Change ownership of the app directory to the nodejs user
RUN chown -R ecommerce:nodejs /app

# Switch to the non-root user
USER ecommerce

# Expose the port the app runs on
EXPOSE 5000

# Health check to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["pnpm", "start"]