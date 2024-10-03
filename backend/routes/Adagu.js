// routes/adagu.js
const express = require('express');
const router = express.Router();
const Adagu = require('../models/adagu_entry'); 

router.post('/add', async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Log the received body
    const newAdagu = new Adagu(req.body);
    const savedAdagu = await newAdagu.save();
    res.json(savedAdagu);
  } catch (err) {
    console.error('Error saving Adagu entry:', err);
    res.status(500).json({ error: 'Error saving Adagu entry' });
  }
});
// Example backend route for fetching all adagu entries
router.get('/all', async (req, res) => {
  try {
    const adaguEntries = await Adagu.find();
    res.status(200).json(adaguEntries);
  } catch (error) {
    console.error('Error fetching adagu entries:', error);
    res.status(500).json({ error: 'Failed to fetch adagu entries' });
  }
});


module.exports = router;
