// server.js
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const mockingModule = require('./mockingModule');
const errorHandler = require('./errorHandler');
const loggerMiddleware = require('./loggerMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');
const authController = require('./controllers/authController');

// Configuración de la base de datos
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Configuración de la sesión
const store = new MongoDBStore({
  uri: 'mongodb://localhost/mydatabase',
  collection: 'sessions'
});

app.use(session({
  secret: 'mi secreto',
  store: store,
  resave: false,
  saveUninitialized: false
}));

// Configuración de Passport
passport.use(new LocalStrategy(authController.localStrategy));
passport.serializeUser(authController.serializeUser);
passport.deserializeUser(authController.deserializeUser);

app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(express.json());
app.use(loggerMiddleware);

// Rutas
app.get('/mockingproducts', (req, res) => {
  res.json(mockingModule.getMockingProducts());
});

app.post('/products', productController.createProduct);

app.post('/orders', orderController.createOrder);

app.get('/orders', orderController.getOrders);

app.get('/orders/:id', orderController.getOrder);

app.put('/orders/:id', orderController.updateOrder);

app.delete('/orders/:id', orderController.deleteOrder);

app.post('/login', authController.login);

app.post('/register', authController.register);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler.errorHandler);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});