const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Ensure correct path

// Utility function to filter out undefined properties
const filterCustomerData = (data) => {
    const allowedFields = [
        'date', 'customerId', 'customerName', 'loanNumber', 
        'fatherName', 'address', 'loanAmount', 'rupeesInWords',
        'mobileNumber1', 'jDetails', 'quantity', 'iw', 'schema',
        'percent', 'lastDateForLoan'
    ];
    let filteredData = {};
    allowedFields.forEach(field => {
        if (data[field] !== undefined) {
            filteredData[field] = data[field];
        }
    });
    return filteredData;
};

// Create a new customer entry
router.post('/create', async (req, res) => {
    try {
        const customerData = filterCustomerData(req.body);
        console.log('Filtered customer data:', customerData); // Log filtered data
        const customer = new Customer(customerData);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
