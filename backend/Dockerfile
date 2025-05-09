# Use Node.js LTS as the base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set the correct permissions
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
