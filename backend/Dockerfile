# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Stage 2: Build
FROM base AS build
RUN apk add --no-cache python3 make g++

# Copiar package.json y package-lock.json del backend
COPY package*.json ./

# Instalar dependencias solo de producción
RUN npm ci --only=production

# Copiar todo el backend
COPY . .

# Copiar y construir frontend dentro del build del backend (opcional si quieres servirlo desde backend)
COPY ../frontend/package*.json ./frontend/
RUN cd frontend && npm install
RUN cd frontend && npm run build

# Stage 3: Producción
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copiar desde la build
COPY --from=build /app /app
COPY --from=build /app/frontend/dist /app/frontend/dist

# Exponer puerto del backend
EXPOSE 3000

# Ejecutar la app backend
CMD ["node", "backend/index.js"]
