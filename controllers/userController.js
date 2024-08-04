const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const logger = require('../logger');
const bcrypt = require('bcrypt');

// Función para verificar la sesión y obtener el usuario
const getUserFromSession = async (req) => {
  const token = req.headers.authorization;
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded._id);
  } catch (error) {
    logger.error(error);
    return null;
  }
};

// Función para verificar el rol del usuario
const verifyRole = async (req, role) => {
  const user = await getUserFromSession(req);
  if (!user || user.role !== role) {
    return false;
  }
  return true;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    user.last_connection = new Date();
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    user.last_connection = null;
    await user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPremium = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!await verifyRole(req, 'premium')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(user);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = token;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password',
      text: `Please click on the link to reset your password: ${process.env.CLIENT_URL}/