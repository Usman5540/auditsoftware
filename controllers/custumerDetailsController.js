const User = require('../models/userModel');  // Import your User model

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is in req.user (from JWT middleware)
        const { 
            company, 
            companyEmail,  
            contactPerson, 
            designation, 
            address, 
            city, 
            website, 
            phoneNumber, 
            ntn, 
            strn, 
            description,
            logoPicture  // Handling the logo picture if updated
        } = req.body;

        // Prepare the update object
        const updateData = {
            userDetails: {
                company,
                companyEmail,
                contactPerson,
                designation,
                address,
                city,
                website,
                phoneNumber,
                ntn,
                strn,
                description,
                logoPicture  // This should be updated via file upload
            }
        };

        // Find user by ID and update their userDetails
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true } // Options to return the updated document and run validators
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                userDetails: updatedUser.userDetails, // Returning the updated userDetails
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};
