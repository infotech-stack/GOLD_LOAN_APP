const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  loanNumber: { type: String, required: true },
  fatherName: { type: String, required: true },
  address: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  rupeesInWords: { type: String },
  mobileNumber1: { type: String },
  jDetails: { type: String },
  quantity: { type: Number },
  iw: { type: Number },
  schema: { type: String },
  percent: { type: String },
  lastDateForLoan: { type: Date },
});

module.exports = mongoose.model('Customer', customerSchema);
