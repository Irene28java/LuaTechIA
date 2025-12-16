# -------------------- Etapa 1: Build --------------------
FROM node:20 AS build

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json para backend
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install --only=production

# Copiar todo el backend
COPY backend ./backend

# Copiar frontend y sus package.json
COPY frontend/package*.json frontend/

# Instalar dependencias del frontend
RUN cd frontend && npm install

# Construir el frontend
RUN cd frontend && npm run build

# -------------------- Etapa 2: Producción --------------------
FROM node:20-slim

WORKDIR /app

# Copiar backend y node_modules desde la etapa de build
COPY --from=build /app/backend ./backend
COPY --from=build /app/node_modules ./node_modules

# Copiar frontend construido
COPY --from=build /app/frontend/dist ./frontend/dist

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Ejecutar backend que sirve frontend
CMD ["node", "backend/index.js"]
