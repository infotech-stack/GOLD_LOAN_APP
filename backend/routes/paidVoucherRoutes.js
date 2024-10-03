const express = require('express');
const router = express.Router();
const PaidVoucher = require('../models/paidvouchers');

// Create a new Paid Voucher
router.post('/add', async (req, res) => {
  try {
    const { name, amount, rupeesInWords, purposeOfAmount, receivedSignPath, authorizedSignPath, date } = req.body;

    const newPaidVoucher = new PaidVoucher({
      name,
      amount,
      rupeesInWords,
      purposeOfAmount,
      receivedSignPath,
      authorizedSignPath,
      date,
    });

    await newPaidVoucher.save();
    res.status(201).json(newPaidVoucher);
  } catch (error) {
    console.error('Error adding paid voucher:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all Paid Vouchers
router.get('/all', async (req, res) => {
  try {
    const paidVouchers = await PaidVoucher.find();
    res.json(paidVouchers);
  } catch (error) {
    console.error('Error fetching paid vouchers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Edit an existing Paid Voucher by ID
router.put('/edit/:id', async (req, res) => {
  try {
    const { name, amount, rupeesInWords, purposeOfAmount, receivedSignPath, authorizedSignPath, date } = req.body;

    const updatedPaidVoucher = await PaidVoucher.findByIdAndUpdate(
      req.params.id,
      { name, amount, rupeesInWords, purposeOfAmount, receivedSignPath, authorizedSignPath, date },
      { new: true } // Return the updated document
    );

    if (!updatedPaidVoucher) {
      return res.status(404).json({ message: 'Paid voucher not found' });
    }

    res.status(200).json(updatedPaidVoucher);
  } catch (error) {
    console.error('Error updating paid voucher:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete a Paid Voucher by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedPaidVoucher = await PaidVoucher.findByIdAndDelete(req.params.id);

    if (!deletedPaidVoucher) {
      return res.status(404).json({ message: 'Paid voucher not found' });
    }

    res.status(200).json({ message: 'Paid voucher deleted successfully' });
  } catch (error) {
    console.error('Error deleting paid voucher:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
