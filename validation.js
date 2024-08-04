export function validateRequest(req, res, next) {
    // Verificar si la solicitud es válida
    if (!req.body || !req.body.isValid()) {
      return res.status(400).json({ message: 'Solicitud inválida' });
    }
    next();
  }