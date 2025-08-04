# ---- Stage 1: Build ----
FROM node:current AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build Vite app
COPY . .
RUN npm run build

# ---- Stage 2: Runtime ----
FROM node:current
WORKDIR /app

# Copy everything (build + source)
COPY --from=builder /app ./

# Install only production dependencies (optional)
RUN npm ci --omit=dev

EXPOSE 8080
EXPOSE 20127/udp
CMD ["node", "server.js"]
