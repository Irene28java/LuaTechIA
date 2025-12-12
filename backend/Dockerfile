# Usamos Node 20 oficial
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json primero (para cachear dependencias)
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Variables de entorno (opcional, si quieres build-time defaults)
# ENV NODE_ENV=production
# ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "index.js"]
