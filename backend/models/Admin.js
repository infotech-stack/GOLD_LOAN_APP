const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  branch: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  adminId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: { type: [String], required: true }, // Example: ["dashboard", "master", "customer"]
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
