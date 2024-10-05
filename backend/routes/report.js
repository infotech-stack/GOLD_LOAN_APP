const express = require('express');
//const multer = require('multer');
const path = require('path');
const Report = require('../models/report');  // Ensure correct path to the Report model

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('Files:', req.files);  
    console.log('Body:', req.body);    

 
    const totalAmount = parseFloat(req.body.totalAmount) || 0; 
    const loanAmount = parseFloat(req.body.loanAmount) || 0;
    const interestPrinciple = parseFloat(req.body.interestPrinciple) || 0;
    const balancePrinciple = parseFloat(req.body.balancePrinciple) || 0;

    const jewelList = JSON.parse(req.body.jewelList || '[]');

    const newReport = new Report({
      jewelNo: req.body.jewelNo,
      customerName: req.body.customerName,
      date: req.body.date,
      customerId: req.body.customerId,
      loanNo: req.body.loanNo,
      mobileNumber: req.body.mobileNumber,
      address: req.body.address,
      loanAmount: loanAmount,
      totalAmount: totalAmount,
   
      cashReceivedRs: loanAmount,
      rupeesInWords: req.body.rupeesInWords,
      paymentNo: req.body.paymentNo,
      paymentDate: req.body.paymentDate,
      receiptNo: req.body.receiptNo,
      noOfDays: req.body.noOfDays,
      interestPrinciple: interestPrinciple,
      balancePrinciple: balancePrinciple,
      remarks: req.body.remarks,
     
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
