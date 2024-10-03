
const mongoose = require('mongoose');

const loanEntrySchema = new mongoose.Schema({

  paymentDate: { type: String, required: true },
  loanNo: { type: String, required: true },
  customerId: { type: String, required: true },
  loanamountbalance:{type:String,required:true},
  interestbalamount:{type:String,required:true},
  noOfDays: { type: Number, required: true },
  interestPrinciple: { type: Number, required: true },
  interestamount: { type: Number, required: true },
  balance: { type: Number, required: true },
  isClosed: { type: Boolean, default: false }
});

module.exports = mongoose.model('LoanEntry', loanEntrySchema);
