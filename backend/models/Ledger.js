const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jewelSchema = new mongoose.Schema({
  jDetails: { type: String, required: true },
  quality: { type: String, required: true },
  quantity: { type: Number, required: true },
  iw: { type: Number, required: true },
});
const ledgerSchema = new Schema({
  customerId: { type: String, required: true },
  loanNumber: { type: String, required: true, unique: true },
  fatherhusname:{type:String,required:true},
  loanamountbalance: { type: String, default: 'Payment not done' }, 
  interestbalamount: { type: String, default: 'Payment not done' },
  doccharge:{type:String,required:true},

  gw: { type: Number, required: true },
  nw: { type: Number, required: true },
  date: { type: Date, required: true },
  lastDateForLoan:{type:Date,required:true},

  customerName: { type: String, required: true },
  mobileNumber1: { type: String, required: true },
  mobileNumber2: { type: String },
  landmark: { type: String, required: true },
  address: { type: String, required: true },
  jewelList: [jewelSchema],
  schema: { type: String, required: true },
  percent: { type: String, required: true },
  loanAmount: { type: String, required: true },
  interest: { type: String, required: true },
  proof1:  { type: String, default: null },
  proof2: { type: String, default: null },
  proof3: { type: [String], default: [] },
  customerSign: { type: String, default: null },
  customerPhoto: { type: String, default: null },
  thumbImpression: { type: String, default: null }, 
});

module.exports = mongoose.model('Ledger', ledgerSchema);
