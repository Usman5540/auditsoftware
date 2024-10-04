const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const dotenv=require("dotenv")
dotenv.config()
console.log(process.env.JWT_SECRET)
exports.signup = async (req, res) => {
    try {
        const { 
            email, 
            password, 
            confirmPassword, 
            company,
            companyEmail,
            contactPerson,
            phoneNumber,
            website,
            description,
            designation,
            address
        } = req.body;

        // Check if both email, password and confirmPassword fields are provided
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email, password, and confirm password are required'
            });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Passwords do not match'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already exists with this email'
            });
        }

        // Handle logo picture upload
        let logoPicture = null; // Initialize logo picture object
        if (req.file) {
            logoPicture = {
                filename: req.file.originalname,
                path: req.file.path,
                mimetype: req.file.mimetype
            };
        } else {
            // If no file is uploaded, logoPicture remains null
            logoPicture = null;
        }

        // Create the new user with email and password
        const newUser = await User.create({ 
            email, 
            password, 
            mobileNumber: phoneNumber, // Store the mobile number in the main user document
            userDetails: {             // Embed userDetails directly
                company,
                companyEmail,          // Save company email
                contactPerson,
                phoneNumber,
                website,
                description,
                designation,
                address,
                logoPicture,           // Include logoPicture in userDetails
            }
        });

        // Generate JWT Token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // If both are successful, return the response
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
                token  // Return the token upon successful signup
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};
//Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if both fields are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email and password are required'
            });
        }

        // Find the user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            });
        }

        // Check if the password matches
        const isPasswordCorrect = await user.correctPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};