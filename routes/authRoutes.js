const express = require('express');
const userController = require('../controllers/authController');
const userDetailsController = require('../controllers/custumerDetailsController');
const authMiddleware = require('../middlewares/auth'); // Middleware to protect routes after login

const router = express.Router();

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes (only accessible after login)
router.post('/updateProfile', authMiddleware.protect, userDetailsController.updateUserProfile);

module.exports = router;
