const mongoose = require('mongoose');
const GoldLoanEntrySchema = new mongoose.Schema({
  date: { type: Date },
  customerId: { type: String },
  customerName: { type: String },
  fatherName: { type: String },
  address: { type: String },
  aadhaarNumber: { type: String },
  mobileNumber: { type: String },
  occupation: { type: String },
  interestRate: { type: Number },
  tenure: { type: String },
  amount: { type: Number },
  goldSaleNo: { type: String },
  saleAmount: { type: Number },
  grossWeight: { type: Number },
  netWeight: { type: Number },
  otherBankName: { type: String },
  otherBankAmount: { type: Number },
  pledgeAmount: { type: Number },
  serviceCharge: { type: Number },
  amountGiven: { type: Number },
  goodsDescription: { type: String },
  quantity: { type: Number },
  purity: { type: String }
});

module.exports = mongoose.model('GoldLoanEntry', GoldLoanEntrySchema);
