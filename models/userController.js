// controllers/userController.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const logger = require('../logger');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    user.last_connection = new Date();
    await user.save();
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = req.user;
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
      text: `Please click on the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error); 
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Email sent successfully' });
    });
  } catch (error) {
    logger.error(error); 
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) return res.status(404).json({ message: 'User not found' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Token expired or invalid' });

      user.password = await bcrypt.hash(newPassword, 10); 
      user.resetPasswordToken = undefined;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
    });
  } catch (error) {
    logger.error(error); 
    res.status(500).json({ message: 'Server error' });
  }
};
