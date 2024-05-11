const express = require('express');
const app = express();
const mockingModule = require('./mockingModule');
const errorHandler = require('./errorHandler');

app.use(express.json());

app.get('/mockingproducts', (req, res) => {
  res.json(mockingModule.getMockingProducts());
});

app.post('/products', (req, res) => {
  // Crear producto
  const product = {...req.body };
  //...
  if (/* error creating product */) {
    return errorHandler.errorHandler({ code: 'PRODUCT_CREATION_ERROR' }, req, res);
  }
  res.json(product);
});

app.use(errorHandler.errorHandler);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});