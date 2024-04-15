const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: 'Unauthorized.' });
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ message: 'Unauthorized.' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized.' });
  }
};