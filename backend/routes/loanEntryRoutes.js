const express = require('express');
const router = express.Router();
const LoanEntry = require('../models/loanEntry');

// Route to add a new loan entry
router.post('/add', async (req, res) => {
  try {
    // Extract data from the request body
    const newLoanEntryData = req.body;

    // Create a new LoanEntry document with the provided data
    const newLoanEntry = new LoanEntry(newLoanEntryData);

    // Save the new LoanEntry to the database
    await newLoanEntry.save();

    // Respond with the newly created LoanEntry
    res.status(201).json(newLoanEntry);
  } catch (error) {
    console.error('Error saving loan entry:', error);
    res.status(500).json({ message: 'Failed to save loan entry', error });
  }
});

// Route to fetch loan entry by loan number
router.get('/byLoanNo/:loanNo', async (req, res) => {
  try {
    const loanNo = req.params.loanNo;
    const entries = await LoanEntry.find({ loanNo: loanNo }).sort({ paymentDate: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).send('Server Error');
  }
});
// Route to fetch loan entry by loan number


// Route to fetch all loan entries
router.get('/all', async (req, res) => {
  try {
    const loanEntries = await LoanEntry.find();
    res.status(200).json(loanEntries);
  } catch (error) {
    console.error('Error fetching loan entries:', error);
    res.status(500).json({ message: 'Failed to fetch loan entries', error });
  }
});
router.get('/:loanNumber', async (req, res) => {
  try {
    const loanNumber = req.params.loanNumber;
    const loanEntry = await LoanEntry.findOne({ loanNumber: loanNumber });
    if (loanEntry) {
      res.json({ balance: loanEntry.balance });
    } else {
      res.status(404).json({ message: 'Loan entry not found' });
    }
  } catch (error) {
    console.error('Error fetching loan entry:', error);
    res.status(500).json({ message: 'Failed to fetch loan entry', error });
  }
});
router.put('/updateClosed/:loanNo', async (req, res) => {
  try {
    const { loanNo } = req.params;
    const loanEntry = await LoanEntry.findOne({ loanNo });
    const newBalance = loanEntry.balance;

    if (newBalance === 0) {
      await LoanEntry.updateOne({ loanNo }, { isClosed: true });
    }

    res.status(200).send({ message: 'Loan entry updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating loan entry' });
  }
});
// Example update function
router.put("/updateLoan/:loanNo", async (req, res) => {
  const { loanNo } = req.params;
  const { lastDateForLoan, schema, percent, loanamountbalance, interestbalamount } = req.body;

  try {
    const updatedLoanEntry = await LoanEntry.findOneAndUpdate(
      { loanNo },
      { 
        lastDateForLoan, 
        schema, 
        percent,
        loanamountbalance, // Update loan amount balance
        interestbalamount // Update interest balance amount
      },
      { new: true }
    );

    if (updatedLoanEntry) {
      res.status(200).json(updatedLoanEntry);
    } else {
      res.status(404).json({ message: "Loan entry not found for this loan number" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Route to delete a loan entry by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await LoanEntry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Loan entry not found' });
    }

    res.status(200).json({ message: 'Loan entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting loan entry:', error);
    res.status(500).json({ message: 'Failed to delete loan entry', error });
  }
});
router.put("/updateLoan/:loanNo", async (req, res) => {
  console.log("PUT request received for loanNumber:", req.params.loanNo);
  console.log("Request body:", req.body);
  const { loanNo } = req.params;
  const { lastDateForLoan, schema, percent } = req.body;

  try {
    const updatedLedger = await Ledger.findOneAndUpdate(
      { loanNo },
      { lastDateForLoan, schema, percent },
      { new: true }
    );

    if (updatedLedger) {
      res.status(200).json(updatedLedger);
    } else {
      res.status(404).json({ message: "Ledger entry not found for this loan number" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
