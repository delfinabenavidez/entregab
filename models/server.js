const express = require('express');
const app = express();
const mockingModule = require('./mockingModule');
const errorHandler = require('./errorHandler');
const loggerMiddleware = require('./loggerMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


app.use(express.json());
app.use(loggerMiddleware);

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler.errorHandler);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});