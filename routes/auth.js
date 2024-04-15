const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = jwt.sign({ _id: req.user._id }, 'your_jwt_secret', {
      expiresIn: '1h'
    });
    res.cookie('jwt', token, { httpOnly: true });
    res.status(200).json({ user: req.user });
  }
);

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({ user: req.user });
  }
);

module.exports = router;