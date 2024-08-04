const logger = require('./logger');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./models/Users');

// Configuración de Passport
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  // Buscar usuario en la base de datos
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    // Retornar usuario
    return done(null, user);
  });
}));

// Middleware de autenticación
module.exports = (req, res, next) => {
  // Verificar si hay un token de autorización en la solicitud
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  // Verificar token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Buscar usuario en la base de datos
    User.findById(decoded.userId, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      // Asignar usuario a la solicitud
      req.user = user;

      // Llamar al siguiente middleware
      next();
    });
  });
};

// Función para generar token de autorización
module.exports.generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });

  return token;
};

// Función para verificar contraseña
module.exports.validPassword = (password, user) => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  const hashedPassword = hash.digest('hex');

  return hashedPassword === user.password;
};