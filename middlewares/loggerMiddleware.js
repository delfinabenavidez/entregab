const logger = require('./logger');

module.exports = (req, res, next) => {
  logger.info(`Request received for ${req.url}`);
  next();
};