// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout/:userId/:sessionId', authController.logoutUser);
module.exports = router;
