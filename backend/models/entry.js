const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  loanNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  loanCategory: { type: String, required: true },
  date: { type: Date, required: true },
  metal: { type: [String], required: true },
  productName: { type: String, required: true },
  eligibilityCriteria: { type: [String], required: true },
  processingFees: { type: String, required: true },
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
