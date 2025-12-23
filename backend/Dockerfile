FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS build
RUN apk add --no-cache python3 make g++
COPY package*.json ./       
COPY frontend/package*.json ./frontend/ 
RUN npm ci --only=production
RUN cd frontend && npm install
COPY . . 
RUN cd frontend && npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/backend /app/backend
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/frontend/dist /app/frontend/dist
COPY backend/index.js ./backend/index.js
COPY backend/lib ./backend/lib
COPY backend/routes ./backend/routes
COPY backend/middlewares ./backend/middlewares
EXPOSE 3000 
CMD ["node", "backend/index.js"]
