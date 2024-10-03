const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  salaryAmount: {
    type: Number,
    required: true,
  },
});

const Salary = mongoose.model('Salary', SalarySchema);

module.exports = Salary;
