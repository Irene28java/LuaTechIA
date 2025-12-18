// CommonJS version compatible con PM2
require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'lua-backend',
      script: './index.js',  // apunta a tu index.js
      env: {
        ...process.env,      // importa todas las variables de .env
      },
      watch: false
    },
  ],
};
