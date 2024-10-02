const Customer = require('../models/custumerModel.js');

// Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        const newCustomer = await Customer.create(req.body);
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
        const customers = await Customer.find();
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
        const customer = await Customer.findById(req.params.id);
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
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
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
        const customer = await Customer.findByIdAndDelete(req.params.id);
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
        const count = await Customer.countDocuments();
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
        const customers = await Customer.find().select('companyName contactPerson mobileNo logo');
        const customerList = customers.map((customer, index) => ({
            sr: index + 1,
            logo: customer.logo,
            company: customer.companyName,
            person: customer.contactPerson,
            phone: customer.mobileNo
        }));
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
        const customer = await Customer.findById(req.params.id);
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
