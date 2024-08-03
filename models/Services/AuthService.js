const passport = require('passport');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Role = require('../models/Role');

class AuthService {
  async login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging in' });
        }
        return res.json({ message: 'Logged in successfully' });
      });
    })(req, res, next);
  }

  async register(req, res, next) {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    const role = await Role.findOne({ name: 'user' });
    user.roles.push(role);
    await user.save();
    return res.json({ message: 'User created successfully' });
  }
}

module.exports = AuthService;