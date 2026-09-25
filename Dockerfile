# build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# runtime
FROM node:20-alpine AS runtime
ENV NODE_ENV=production

# прод-зависимости бэкенда
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# скомпилированный JS + миграции
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/migrations ./migrations

# собранная статика
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# запуск приложения из корня
WORKDIR /app
EXPOSE 3000
CMD ["node", "backend/dist/index.js"]