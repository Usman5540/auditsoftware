const User = require('../models/userModel.js'); // Use User model as per the provided schema

// Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        // Create a new user instance based on the request body
        const newCustomer = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { customer: newCustomer }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find().select('-password'); // Exclude password from the response
        res.status(200).json({
            status: 'success',
            results: customers.length,
            data: { customers }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id).select('-password'); // Exclude password
        if (!customer) {
            return res.status(404).json({ status: 'fail', message: 'Customer not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { customer }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
    try {
        // Update customer details with validation
        const customer = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            select: '-password' // Exclude password from the response
        });
        if (!customer) {
            return res.status(404).json({ status: 'fail', message: 'Customer not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { customer }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await User.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ status: 'fail', message: 'Customer not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get the total number of customers
exports.getCustomerCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({
            status: 'success',
            data: { count }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get a list of customers (Sr., logo, companyName, contactPerson, phone)
exports.getCustomerList = async (req, res) => {
    try {
        // Fetch users and select the relevant fields
        const customers = await User.find().select('mobileNumber userDetails.company userDetails.contactPerson userDetails.logoPicture _id');
        
        // Map over the customers and construct the response
        const customerList = customers.map((customer, index) => {
            const userDetails = customer.userDetails || {};  // Ensure userDetails exists
            const logoPicture = userDetails.logoPicture || {};  // Ensure logoPicture exists

            return {
                sr: index + 1,
                id: customer._id, 
                logo: logoPicture.path || null,  // Safely access logoPicture.path
                company: userDetails.company || null,  // Safely access company
                contactPerson: userDetails.contactPerson || null,  // Safely access contact person
                phone: customer.mobileNumber || null  // Access mobileNumber directly from the root level
            };
        });

        // Send the response
        res.status(200).json({
            status: 'success',
            data: { customerList }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};




// Get detailed customer information by ID
exports.getCustomerDetail = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id).select('-password'); // Exclude password
        if (!customer) {
            return res.status(404).json({ status: 'fail', message: 'Customer not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { customer }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
