

const mongoose = require('mongoose');

const schemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  interestPercent: {
    type: String,
    required: true,
    set: (value) => `${value}%`
  },
  timePeriod: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Schema', schemaSchema);
