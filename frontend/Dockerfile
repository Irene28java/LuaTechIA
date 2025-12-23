# Stage 1: Build de la aplicación frontend
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código frontend
COPY . .

# Construir la aplicación
RUN npm run build

# Stage 2: Servir con Nginx
FROM nginx:alpine

# Copiar la carpeta dist construida
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copiar configuración de Nginx opcional (si quieres)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
