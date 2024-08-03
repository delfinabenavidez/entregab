import { errorHandler, logger } from './utils.js';
import { authenticate, authorize } from './auth.js';
import { validateRequest } from './validation.js';

export const middleware = [
  logger,
  authenticate,
  authorize,
  validateRequest,
  errorHandler
];

// Función para autenticar al usuario
function authenticate(req, res, next) {
  // Verificar si el usuario está autenticado
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  next();
}

// Función para autorizar al usuario
function authorize(req, res, next) {
  // Verificar si el usuario tiene permiso para acceder al recurso
  if (!req.user.hasPermission(req.method, req.path)) {
    return res.status(403).json({ message: 'No autorizado' });
  }
  next();
}

// Función para validar la solicitud
function validateRequest(req, res, next) {
  // Verificar si la solicitud es válida
  if (!req.body || !req.body.isValid()) {
    return res.status(400).json({ message: 'Solicitud inválida' });
  }
  next();
}