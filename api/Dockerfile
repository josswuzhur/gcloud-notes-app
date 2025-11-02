# 1. Use a small Node.js base image
FROM node:20-alpine

# 2. Set working directory in container
WORKDIR /usr/src/app

# 3. Copy package files first (for efficient caching)
COPY package*.json ./

# 4. Install dependencies (omit dev dependencies)
RUN npm ci --omit=dev

# 5. Copy your application code
COPY . .

# 6. Tell Cloud Run what port to listen on
ENV PORT=8080

# 7. Start the server
CMD ["npm", "start"]
