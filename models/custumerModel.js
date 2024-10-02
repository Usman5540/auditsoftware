const mongoose = require('mongoose');

// Define UserDetails Schema
const userDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
    },
    contactPerson: {
        type: String,
        required: [true, 'Contact person is required'],
    },
    designation: {
        type: String,
        required: [true, 'Designation is required'],
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile number is required'],
    },
    companyPhoneNo: String,
    companyAddress: {
        type: String,
        required: [true, 'Company address is required'],
    },
    website: String,
    description: String,
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = UserDetails;
