const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema for file uploads (Logo Picture)
const fileSchema = new mongoose.Schema({
    filename: {
        type: String, // Filename should be a string
        // required: true,
    },
    path: {
        type: String,
        // required: true,
    },
    mimetype: {
        type: String,
        // required: true,
    },
}, { _id: false });

// Define UserDetails Schema
const userDetailsSchema = new mongoose.Schema({
    company: {
        type: String,
        // required: [true, 'Company is required'],
    },
    companyEmail: { // Added field for company email
        type: String,
        // required: [true, 'Company email is required'],
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v); // Basic email validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    contactPerson: {
        type: String,
        // required: [true, 'Contact person is required'],
    },
    designation: {
        type: String,
        // required: [true, 'Designation is required'],
    },
    address: {
        type: String,
        // required: [true, 'Address is required'],
    },
    website: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        // required: [true, 'City is required'], // Uncomment if city is mandatory
    },
    phoneNumber: {
        type: String,
        // required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^\+?([0-9]{1,3})?[-.\s]?(\(?[0-9]{1,4}\)?)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    logoPicture: fileSchema,  // Using the file schema for logo picture
    ntn: {
        type: String,
        // required: [true, 'NTN is required'], // Uncomment if NTN is mandatory
    },
    strn: {
        type: String,
        // required: [true, 'STRN is required'], // Uncomment if STRN is mandatory
    },
}, { _id: false });  // Disable _id for subdocuments

// Define User Schema and embed userDetailsSchema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v);  // Basic email validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    mobileNumber: {
        type: String,
        // required: [true, 'Mobile number is required'],
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);  // Basic validation for mobile number
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 4,
        select: false,  // Ensure password is not selected in queries
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer',
        required: true
    },
    description: {
        type: String,
        default: null
    },
    userDetails: userDetailsSchema,  // Embedding UserDetails as a subdocument
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();  // Only hash if password is modified
    this.password = await bcrypt.hash(this.password, 12);  // Hash password with cost factor of 12
    next();
});

// Method to compare password during login
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
