// routes/Admin.js

const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new admin
router.post('/register', async (req, res) => {
  try {
    const { name, designation, branch, phoneNumber, adminId, password, permissions } = req.body;

    // Check if admin ID already exists
    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin ID already exists' });
    }

    // Store password as plain text (not recommended)
    const newAdmin = new Admin({
      name,
      designation,
      branch,
      phoneNumber,
      adminId,
      password, // Store without hashing
      permissions,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/login', async (req, res) => {
  console.log('Admin Login request body:', req.body);
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({ message: 'Admin ID and password are required' });
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (password !== admin.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', adminId });
  } catch (error) {
    console.error('Admin Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/:adminId/permissions', async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const permissions = admin.permissions;
    res.status(200).json({ permissions });
  } catch (error) {
    console.error('Error fetching permissions:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:adminId', async (req, res) => {
  const { adminId } = req.params;
  const { name, designation, branch, phoneNumber, permissions,password,} = req.body;

  try {
      const updatedAdmin = await Admin.findOneAndUpdate(
          { adminId },
          { name, designation, branch, phoneNumber, permissions,password},
          { new: true }
      );

      if (!updatedAdmin) {
          return res.status(404).json({ message: 'Admin not found' });
      }

      res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
  } catch (error) {
      console.error('Error updating admin:', error.message);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/:adminId', async (req, res) => {
  const { adminId } = req.params;

  try {
      const deletedAdmin = await Admin.findOneAndDelete({ adminId });
      if (!deletedAdmin) {
          return res.status(404).json({ message: 'Admin not found' });
      }

      res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
      console.error('Error deleting admin:', error.message);
      res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
