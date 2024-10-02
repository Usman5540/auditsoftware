const UserDetails = require('../models/custumerModel');

// Update User Details
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is in req.user (from JWT middleware)
        const { companyName, contactPerson, designation, mobileNo, companyPhoneNo, companyAddress, website, description } = req.body;

        const updatedDetails = await UserDetails.create(
            
            {
                userId,
                companyName,
                contactPerson,
                designation,
                mobileNo,
                companyPhoneNo,
                companyAddress,
                website,
                description
            },
        );

        res.status(200).json({
            status: 'success',
            data: {
                userDetails: updatedDetails,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};
