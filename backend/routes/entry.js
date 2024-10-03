//backend/routes/entry.js 
const express = require('express');
const router = express.Router();
const Entry = require('../models/entry');

router.post('/add', async (req, res) => {
  try {
    const {
      loanNumber,
      customerName,
      loanCategory,
      date,
      metal,
      productName,
      eligibilityCriteria,
      processingFees,
    } = req.body;

    const newEntry = new Entry({
      loanNumber,
      customerName,
      loanCategory,
      date,
      metal,
      productName,
      eligibilityCriteria,
      processingFees,
    });

    await newEntry.save();

    res.status(201).json({ message: 'Entry added successfully' });
  } catch (err) {
    console.error('Error adding entry:', err);
    res.status(500).json({ error: 'Failed to add entry' });
  }
});

// GET: Fetch all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.status(200).json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

router.get('/latest-loan-number', async (req, res) => {
  try {
    const latestEntry = await Entry.findOne().sort({ loanNumber: -1 }).exec();
    if (latestEntry) {
      res.json({ latestLoanNumber: latestEntry.loanNumber });
    } else {
      res.json({ latestLoanNumber: 'GL000' }); // Initial value to increment from GL001
    }
  } catch (error) {
    console.error('Error fetching latest loan number:', error);
    res.status(500).json({ error: 'Failed to fetch latest loan number' });
  }
});

module.exports = router;
