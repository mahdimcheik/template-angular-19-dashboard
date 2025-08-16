# FROM node:20 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci

# FROM build AS production
# COPY . .
# RUN npm run build:prod


# FROM nginx:alpine as prod-runtime
# COPY --from=production /app/dist/skill-hive/browser /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Base
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 3: Production (your target)
FROM base AS production
COPY . .
RUN npm run build:prod

# Stage 4: Runtime (comes AFTER production)
FROM nginx:alpine AS runtime
COPY --from=production /app/dist/skill-hive/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]