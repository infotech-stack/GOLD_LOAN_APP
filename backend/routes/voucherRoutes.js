const express = require('express');
const router = express.Router();
const Voucher = require('../models/voucher');

router.post('/add', async (req, res) => {
  try {
    const { name, amount, rupeesInWords, purposeOfAmount, date } = req.body;

    const newVoucher = new Voucher({
      name,
      amount,
      rupeesInWords,
      purposeOfAmount,
      date,
    });

    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error('Error adding voucher:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.put('/edit/:id', async (req, res) => {
  try {
    const { name, amount, rupeesInWords, purposeOfAmount, date } = req.body;

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      { name, amount, rupeesInWords, purposeOfAmount, date },
      { new: true } // Return the updated document
    );

    if (!updatedVoucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    res.status(200).json(updatedVoucher); // Respond with the updated voucher data
  } catch (error) {
    console.error('Error updating voucher:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);

    if (!deletedVoucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;



