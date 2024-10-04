const express = require('express');
const multer = require('multer'); // Import multer
const userController = require('../controllers/authController');
const userDetailsController = require('../controllers/custumerDetailsController');
const authMiddleware = require('../middlewares/auth'); // Middleware to protect routes after login

const router = express.Router();

// Set up Multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define upload folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
    }
});

// Create the multer instance
const upload = multer({ storage });

// Public routes
router.post('/signup', upload.single('logoPicture'), userController.signup); // Handle file upload in signup
router.post('/login', userController.login);

// Protected routes (only accessible after login)
router.post('/updateProfile', authMiddleware.protect , userDetailsController.updateUserProfile);

module.exports = router;
