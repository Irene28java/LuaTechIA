# -------------------- Base --------------------
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# -------------------- Build --------------------
FROM base AS build

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++ 

# Copiar package.json del root y del frontend
COPY package*.json ./       # Esto es para backend
COPY frontend/package*.json ./frontend/  # Esto es para frontend

# Instalar dependencias root y frontend
RUN npm ci --only=production
RUN cd frontend && npm install  # Instalar dependencias frontend

# Copiar todo el código
COPY . . 

# Build del frontend
RUN cd frontend && npm run build

# -------------------- Final --------------------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copiar backend y node_modules
COPY --from=build /app/backend /app/backend
COPY --from=build /app/node_modules /app/node_modules

# Copiar frontend build
COPY --from=build /app/frontend/dist /app/frontend/dist

# Servir frontend con express (sin Nginx)
COPY backend/index.js ./backend/index.js
COPY backend/lib ./backend/lib
COPY backend/routes ./backend/routes
COPY backend/middlewares ./backend/middlewares

EXPOSE 3000 

CMD ["node", "backend/index.js"]
