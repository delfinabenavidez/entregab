const dotenv = require('dotenv');

dotenv.config();

const config = {
  // Configuración de la aplicación
  app: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
  },
  // Configuración de la base de datos
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/integracion-ecomerce',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  // Configuración de Swagger
  swagger: {
    title: 'Integración Ecommerce API',
    description: 'API de integración para ecommerce',
    version: '1.0.0',
    host: process.env.HOST || 'localhost',
    basePath: '/api',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
};

module.exports = config;