import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './authRoutes.js';
import passport from 'passport';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Configuración de la base de datos
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Configuración de la sesión
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  store,
  resave: false,
  saveUninitialized: false,
}));

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de compra
import purchaseRoutes from './purchaseRoutes.js';
app.use('/purchase', purchaseRoutes);

// Función para enviar correo de confirmación
import sendConfirmationEmail from './sendConfirmationEmail.js';
app.post('/send-confirmation-email', sendConfirmationEmail);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Error interno del servidor');
});

app.listen(3001, () => {
  console.log('Child process listening on port 3001');
});