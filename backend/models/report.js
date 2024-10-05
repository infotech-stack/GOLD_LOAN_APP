const mongoose = require('mongoose');

const jewelSchema = new mongoose.Schema({
  jDetails: { type: String, default: '' },
  quality: { type: String, default: '' },
  quantity: { type: Number, default: 0 },
  gw: { type: Number, default: 0 },
  nw: { type: Number, default: 0 },
  iw: { type: Number, default: 0 },
});
const reportSchema = new mongoose.Schema({
  jewelNo: { type: String, default: '' },
  customerName: { type: String, default: '' },
  date: { type: Date, default: null },
  customerId: { type: String, default: '' },
  loanNo: { type: String, default: 'KRT001' },
  mobileNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  loanAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  cashReceivedRs: { type: Number, default: 0 },
  rupeesInWords: { type: String, default: '' },
  paymentNo: { type: String, default: '' },
  paymentDate: { type: Date, default: null },
  receiptNo: { type: String, default: '' },
  noOfDays: { type: Number, default: 0 },
  interestPrinciple: { type: Number, default: 0 },
  balancePrinciple: { type: Number, default: 0 },
  remarks: { type: String, default: '' },
  closedate: { type: Date, default: null },
  lastDateForLoan:{type:Date,default:null},
  jewels: [jewelSchema] 
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
