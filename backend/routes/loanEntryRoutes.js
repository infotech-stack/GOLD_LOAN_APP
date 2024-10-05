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
    const {
      customerId,
      noOfDays,
      interestbalamount,
      loanamountbalance,  // New loan amount balance for this new payment
      interestPrincipleNum,
      interestAmountNum,
      paymentDate
    } = req.body;

    // Validate customerId
    if (!customerId) {
      return res.status(400).send({ message: 'customerId is required' });
    }

    // Validate paymentDate
    if (!paymentDate || isNaN(new Date(paymentDate).getTime())) {
      return res.status(400).send({ message: 'Invalid payment date provided' });
    }

    // Find the existing loan entry by loanNo (the latest one)
    const existingLoanEntry = await LoanEntry.findOne({ loanNo }).sort({ paymentDate: -1 });

    // If no existing loan entry, create a new one
    if (!existingLoanEntry) {
      const newLoanEntry = new LoanEntry({
        loanNo,
        balance: loanamountbalance || 0,  // New balance from the current payment
        isClosed: false,
        interestamount: interestAmountNum,
        interestPrinciple: interestPrincipleNum,
        noOfDays: noOfDays || 0,
        interestbalamount: interestbalamount || 0,
        loanamountbalance: loanamountbalance || 0,  // Initial balance from first payment
        customerId,
        paymentDate: new Date(paymentDate).toISOString().split('T')[0],
      });

      await newLoanEntry.save();
      console.log("New loan entry created for loanNo:", loanNo);
      return res.status(201).send({
        message: 'New loan entry created successfully',
        loanEntry: newLoanEntry
      });
    }

    // If an existing loan entry is found, do NOT update it (leave it as is)

    // Check if loan is already closed
    if (existingLoanEntry.isClosed) {
      return res.status(400).send({
        message: 'Cannot update a closed loan entry',
      });
    }

    // Use the existing loanamountbalance for reference, but do not modify it
    const previousBalance = existingLoanEntry.loanamountbalance;

    // Calculate the new balance (without modifying the existing entry)
    const newBalance = previousBalance - interestAmountNum;

    // Create a new payment entry without modifying the previous one
    const paymentEntry = new LoanEntry({
      loanNo,
      balance: newBalance >= 0 ? newBalance : 0,  // New balance after payment
      isClosed: newBalance === 0,
      interestamount: interestAmountNum,
      interestPrinciple: interestPrincipleNum || 0,
      noOfDays: noOfDays || 0,
      interestbalamount: interestbalamount || 0,
      loanamountbalance: loanamountbalance,  // This is the new loan amount balance (for this payment)
      customerId,
      paymentDate: new Date(paymentDate).toISOString().split('T')[0],
    });

    await paymentEntry.save();
    console.log("New payment entry created for loanNo:", loanNo);

    return res.status(201).send({
      message: 'Payment entry created successfully',
      loanEntry: paymentEntry,
      // Not sending updatedLoanEntry as nothing is updated in the existing entry
    });

  } catch (error) {
    console.error("Error updating loan entry:", error);
    return res.status(500).send({ message: 'Error updating loan entry', error: error.message });
  }
});











router.get('/check/:loanNo', async (req, res) => {
  try {
    const { loanNo } = req.params;

    // Query the database for the loan entry
    const entry = await LoanEntry.findOne({ loanNo: loanNo });

    if (entry) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking loan entry:', error);
    return res.status(500).json({ message: 'Server error' });
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
