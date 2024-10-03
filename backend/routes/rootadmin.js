const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const RootAdmin = require('../models/rootadmin'); // Ensure this is the correct model

// Create or update the root admin (Register route)
router.post('/registers', async (req, res) => {
  try {
    const { rootAdminId, password } = req.body;

    if (!rootAdminId || !password) {
      return res.status(400).json({ message: 'Root Admin ID and password are required' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Find the existing root admin (if any)
    let rootAdmin = await RootAdmin.findOne({});

    if (rootAdmin) {
      // Update the existing root admin
      rootAdmin.rootAdminId = rootAdminId;
      rootAdmin.password = hashedPassword;
      await rootAdmin.save();
      res.status(200).json({ message: 'Root Admin updated successfully', rootAdmin });
    } else {
      // Create a new root admin entry
      rootAdmin = new RootAdmin({ rootAdminId, password: hashedPassword });
      await rootAdmin.save();
      res.status(200).json({ message: 'Root Admin created successfully', rootAdmin });
    }
  } catch (error) {
    console.error('Error creating or updating root admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route (For root admin)
router.post('/login', async (req, res) => {
  const { rootAdminId, password } = req.body;

  // Validate input
  if (!rootAdminId || !password) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    // Find the root admin by ID
    const admin = await RootAdmin.findOne({ rootAdminId });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid Admin ID' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // If login is successful
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
