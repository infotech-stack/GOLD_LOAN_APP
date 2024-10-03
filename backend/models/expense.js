const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  totalRupees: { type: Number, required: true },
  quantity: { type: String }, // Optional field
  weight: { type: String  },   // Optional field
  voucherNo: { type: String }, // Optional field
});

module.exports = mongoose.model('Expense', ExpenseSchema);
