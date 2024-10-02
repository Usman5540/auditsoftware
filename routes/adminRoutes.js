const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();

// Route to get total number of customers
router.get('/customers/count', customerController.getCustomerCount);

// Route to get a list of customers
router.get('/customers/list', customerController.getCustomerList);

// Route to get detailed customer information
router.get('/customers/:id', customerController.getCustomerDetail);

module.exports = router;
