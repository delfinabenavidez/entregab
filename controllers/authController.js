const authService = require('../services/authService');

const authController = {
  async login(req, res, next) {
    return authService.login(req, res, next);
  },

  async register(req, res, next) {
    return authService.register(req, res, next);
  }
};

module.exports = authController;