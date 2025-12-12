#!/bin/bash
set -e  # ⚠️ Detiene el script si hay error

echo "🚧 Compilando frontend..."
cd frontend
npm install
npm run build
cd ..

echo "📦 Preparando backend para Docker..."
# Aquí puedes agregar pasos adicionales si quieres copiar el frontend al backend
# o mover archivos al contenedor si no estás usando Docker COPY.

echo "✅ Build completado. Ahora puedes crear la imagen Docker:"
echo "   docker build -t luacoachia-backend ."
echo "   docker run -p 3000:3000 --env-file .env luacoachia-backend"
