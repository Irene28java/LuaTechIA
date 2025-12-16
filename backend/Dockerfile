FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del backend
COPY . .

# El backend escucha en 3001
EXPOSE 3001

# Arranque estándar
CMD ["npm", "start"]
