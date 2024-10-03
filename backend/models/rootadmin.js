const mongoose = require('mongoose');

const RootAdminSchema = new mongoose.Schema({
  rootAdminId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('RootAdmin', RootAdminSchema);
