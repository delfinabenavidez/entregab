const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production'? 'info' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'errors.log', level: 'error' })
  ]
});

module.exports = logger;