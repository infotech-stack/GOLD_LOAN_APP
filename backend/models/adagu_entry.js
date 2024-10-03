// models/Adagu.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  weight: { type: Number, required: true },
  productSeal: { type: String, required: true }
});

const adaguSchema = new mongoose.Schema({
  loanNumber: { type: String, required: true },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  fatherName: { type: String, required: true },
  place: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  metal: { type: String, required: true },
  products: { type: Array }, // Ensure this matches your frontend structure
  markRate: { type: String, required: true },
  loanValue: { type: String, required: true },
  intRate: { type: String, required: true },
  intType: { type: String, required: true },
  monrate: { type: String, required: true },
  monfirrate: { type: String, required: true },
  docCharges: { type: String, required: true },
  party: { type: String, required: true },
  returnDate: { type: Date, required: true }
});


module.exports = mongoose.model('Adagu', adaguSchema);
