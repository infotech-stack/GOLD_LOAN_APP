const mongoose = require('mongoose');

const paidVoucherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  rupeesInWords: { type: String, required: true },
  purposeOfAmount: { type: String, required: true },
  receivedSignPath: { type: String},
  authorizedSignPath: { type: String},
  date: { type: Date, default: Date.now },
});

const PaidVoucher = mongoose.model("PaidVoucher", paidVoucherSchema);
module.exports = PaidVoucher;
