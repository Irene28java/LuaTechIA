# syntax=docker/dockerfile:1
ARG NODE_VERSION=24.11.1
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
ENV NODE_ENV=production

# -------------------- Build stage --------------------
FROM base AS build

# Dependencias para compilar node_modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential python-is-python3 pkg-config

# Copiar package.json y lockfile
COPY package*.json ./
RUN npm ci

# Copiar todo el backend y frontend
COPY . .

# Compilar frontend
RUN cd frontend && npm install && npm run build

# -------------------- Final stage --------------------
FROM base

# Copiar solo backend y node_modules de producción
COPY --from=build /app/backend /app/backend
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/frontend/dist /app/frontend/dist

# Exponer puerto dinámico
ENV PORT=3000
EXPOSE 3000

# Entrypoint
CMD ["node", "backend/index.js"]
