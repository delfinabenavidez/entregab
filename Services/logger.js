const winston = require('winston');

// Configuración del logger
const loggerConfig = {
  level: process.env.NODE_ENV === 'production'? 'info' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'errors.log', level: 'error' })
  ]
};

// Creación del logger
const logger = winston.createLogger(loggerConfig);

// Función para registrar un mensaje de debug
const debug = (message) => {
  logger.debug(message);
};

// Función para registrar un mensaje de info
const info = (message) => {
  logger.info(message);
};

// Función para registrar un mensaje de warning
const warning = (message) => {
  logger.warning(message);
};

// Función para registrar un mensaje de error
const error = (message) => {
  logger.error(message);
};

// Función para registrar un mensaje de critico
const critico = (message) => {
  logger.critico(message);
};

// Exportación de las funciones de registro
module.exports = {
  debug,
  info,
  warning,
  error,
  critico
};