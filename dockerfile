## Multi-stage Dockerfile: build static production assets, serve with nginx
### Stage 1: build
FROM node:18-bullseye AS build
WORKDIR /app

# Install dependencies using lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

### Stage 2: runtime
FROM nginx:stable-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html

# Add nginx configuration for SPA (fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]