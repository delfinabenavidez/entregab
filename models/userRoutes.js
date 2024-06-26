const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/userController');
const userController = require('../controllers/user.controller');


router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/premium/:uid', userController.getUserPremium);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;