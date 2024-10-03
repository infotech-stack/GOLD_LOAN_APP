const express = require('express');
const router = express.Router();
const GoldLoanEntry = require('../models/GoldLoanEntry');

// Add a new gold loan entry
router.post('/add', async (req, res) => {
  try {
    console.log('Request Payload:', req.body);
    const entry = new GoldLoanEntry(req.body);
    await entry.save();
    res.status(201).send(entry);
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).send({ error: error.message });
  }
});

router.get('/entries', async (req, res) => {
  try {
    const entries = await GoldLoanEntry.find();
    res.status(200).send(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).send({ error: error.message });
  }
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedGoldLoanEntry = await GoldLoanEntry.findByIdAndUpdate(id, updatedData, {
      new: true, // Returns the updated document
    });

    if (!updatedGoldLoanEntry) {
      return res.status(404).send('Gold loan entry not found');
    }

    res.send(updatedGoldLoanEntry);
  } catch (error) {
    console.error('Error updating gold loan entry:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGoldLoanEntry = await GoldLoanEntry.findByIdAndDelete(id);

    if (!deletedGoldLoanEntry) {
      return res.status(404).send('Gold loan entry not found');
    }

    res.status(200).send({ message: 'Entry deleted successfully', deletedGoldLoanEntry });
  } catch (error) {
    console.error('Error deleting gold loan entry:', error);
    res.status(500).send('Internal Server Error');
  }
});




module.exports = router;
