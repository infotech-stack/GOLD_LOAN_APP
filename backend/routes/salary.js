const express = require('express');
const router = express.Router();
const Salary = require('../models/salary');

// Route: POST /api/salary/add
// Description: Add new salary entry
router.post('/add', async (req, res) => {
  const { employeeName, designation, date, salaryAmount } = req.body;

  try {
    const newSalary = new Salary({
      employeeName,
      designation,
      date,
      salaryAmount,
    });

    await newSalary.save();
    res.status(201).json(newSalary); // Respond with the saved salary data
  } catch (error) {
    console.error('Error adding salary:', error);
    res.status(500).json({ error: 'Failed to add salary entry' });
  }
});
router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.status(200).json(salaries);
  } catch (error) {
    console.error('Error fetching salaries:', error);
    res.status(500).json({ error: 'Failed to fetch salary entries' });
  }
});

router.put('/edit/:id', async (req, res) => {
  const { employeeName, designation, date, salaryAmount } = req.body;

  try {
    const updatedSalary = await Salary.findByIdAndUpdate(
      req.params.id,
      { employeeName, designation, date, salaryAmount },
      { new: true } // Return the updated document
    );

    if (!updatedSalary) {
      return res.status(404).json({ error: 'Salary entry not found' });
    }

    res.status(200).json(updatedSalary); // Respond with the updated salary data
  } catch (error) {
    console.error('Error updating salary:', error);
    res.status(500).json({ error: 'Failed to update salary entry' });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedSalary = await Salary.findByIdAndDelete(req.params.id);

    if (!deletedSalary) {
      return res.status(404).json({ error: 'Salary entry not found' });
    }

    res.status(200).json({ message: 'Salary entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting salary:', error);
    res.status(500).json({ error: 'Failed to delete salary entry' });
  }
});

module.exports = router;
