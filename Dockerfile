# Usa Node 20 estable
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
ENV NODE_ENV=production

# Build stage
FROM base AS build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential python-is-python3 pkg-config

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN cd frontend && npm install && npm run build

# Final stage
FROM base
COPY --from=build /app/backend /app/backend
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/frontend/dist /app/frontend/dist

ENV PORT=3000
EXPOSE 3000
CMD ["node", "backend/index.js"]
