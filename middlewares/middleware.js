import { errorHandler, logger } from './utils.js';

export const middleware = [
  logger,
  errorHandler
];