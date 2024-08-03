// controllers/userController.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const logger = require('../logger');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: