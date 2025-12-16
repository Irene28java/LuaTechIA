# Usamos la imagen base de Node.js
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app
RUN npm run build

# Usar Nginx para servir la aplicación construida
FROM nginx:alpine
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html


# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

