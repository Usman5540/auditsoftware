const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const dotenv=require("dotenv")
dotenv.config()
console.log(process.env.JWT_SECRET)
// Signup Controller


exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if both fields are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email and password are required'
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

        // Create the new user
        const newUser = await User.create({ email, password });

        // Generate a JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email }, // Payload
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '10y' } // Token expiration time
        );

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            token // Send the token in the response
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
