// CommonJS para compatibilidad con PM2
require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'lua-backend',
      script: './index.js',        // apunta a tu index.js
      env: {
        ...process.env,            // importa todas las variables de .env
        NODE_ENV: 'production',    // opcional, para producción
      },
      watch: false
    },
  ],
};
