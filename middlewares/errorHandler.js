const errorDictionary = {
  PRODUCT_CREATION_ERROR: 'Error creating product',
  PRODUCT_ALREADY_EXISTS: 'Product already exists',
  CART_ADD_ERROR: 'Error adding product to cart',
  CART_REMOVE_ERROR: 'Error removing product from cart',
  //...
};

const logger = require('./logger'); 

module.exports = {
  errorHandler: (err, req, res, next) => {
    logger.error(err); // registra el error
    const error = errorDictionary[err.code] || 'Internal Server Error';
    res.status(err.status || 500).json({ error });
  },
  handleSessionError: (err, req, res, next) => {
    logger.error(err); // registra el error
    const error = errorDictionary[err.code] || 'Internal Server Error';
    res.status(err.status || 500).json({ error });
  },
  handlePurchaseError: (err, req, res, next) => {
    logger.error(err); // registra el error
    const error = errorDictionary[err.code] || 'Internal Server Error';
    res.status(err.status || 500).json({ error });
  }
};