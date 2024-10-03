const express = require('express');
//const multer = require('multer');
const path = require('path');
const Report = require('../models/report');  // Ensure correct path to the Report model

const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null,'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// POST route to submit the form data
router.post('/', async (req, res) => {
  try {
    console.log('Files:', req.files);  // Debug: Log the files object
    console.log('Body:', req.body);    // Debug: Log the request body

    // Extract file paths safely with default empty strings if files are not present
    // const authorizedFilePath = req.files && req.files.authorizedFile ? req.files.authorizedFile[0].path : '';
    // const customerSignPath = req.files && req.files.customersign ? req.files.customersign[0].path : '';
    // const cashierSignPath = req.files && req.files.cashiersign ? req.files.cashiersign[0].path : '';

    // Convert fields to numbers where appropriate
    const totalAmount = parseFloat(req.body.totalAmount) || 0;  // Ensure it’s a number
    const loanAmount = parseFloat(req.body.loanAmount) || 0;
    const interestPrinciple = parseFloat(req.body.interestPrinciple) || 0;
    const balancePrinciple = parseFloat(req.body.balancePrinciple) || 0;

    const jewelList = JSON.parse(req.body.jewelList || '[]');

    const newReport = new Report({
      jewelNo: req.body.jewelNo,
      customerName: req.body.customerName,
      date: req.body.date,
      customerId: req.body.customerId,
      loanNo: req.body.loanNumber,
      mobileNumber: req.body.mobileNumber,
      address: req.body.address,
      loanAmount: loanAmount,
      totalAmount: totalAmount,
      // customerSign1: authorizedFilePath,
      cashReceivedRs: loanAmount,
      rupeesInWords: req.body.rupeesInWords,
      paymentNo: req.body.paymentNo,
      paymentDate: req.body.paymentDate,
      receiptNo: req.body.receiptNo,
      noOfDays: req.body.noOfDays,
      interestPrinciple: interestPrinciple,
      balancePrinciple: balancePrinciple,
      remarks: req.body.remarks,
      // customerSign: customerSignPath,
      // cashierSign: cashierSignPath,
      closedate: req.body.closedate,
      lastDateForLoan:req.body.lastDateForLoan,
      jewels: jewelList, 
    });

    await newReport.save();
    res.status(201).json({ message: 'Report saved successfully' });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/ledger/loans/:customerId/:loanNumber', async (req, res) => {
  const { customerId, loanNumber } = req.params;
  
  try {
    // Fetch the loan details from MongoDB
    const loanDetails = await Loan.findOne({ customerId, loanNumber });
    
    if (!loanDetails) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    res.json(loanDetails);
  } catch (error) {
    console.error("Error fetching loan details:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = router;
