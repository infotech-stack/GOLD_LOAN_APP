// routes/schemaRoutes.js

const express = require('express');
const Schema = require('../models/schemaModels');
const router = express.Router();

// Get all schemas
router.get('/', async (req, res) => {
  try {
    const schemas = await Schema.find();
    res.json(schemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new schema
router.post('/', async (req, res) => {
  const { name, interestPercent, timePeriod } = req.body;
  const newSchema = new Schema({
    name,
    interestPercent,
    timePeriod,
  });

  try {
    const savedSchema = await newSchema.save();
    res.status(201).json(savedSchema);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a schema
router.put('/:id', async (req, res) => {
  const { name, interestPercent, timePeriod } = req.body;

  try {
    const schema = await Schema.findById(req.params.id);
    if (!schema) {
      return res.status(404).json({ message: 'Schema not found' });
    }

    schema.name = name || schema.name;
    schema.interestPercent = interestPercent || schema.interestPercent;
    schema.timePeriod = timePeriod || schema.timePeriod;

    const updatedSchema = await schema.save();
    res.json(updatedSchema);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a schema
router.delete('/:id', async (req, res) => {
  try {
    const schema = await Schema.findById(req.params.id);
    if (!schema) {
      return res.status(404).json({ message: 'Schema not found' });
    }

    await schema.remove();
    res.json({ message: 'Schema deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
