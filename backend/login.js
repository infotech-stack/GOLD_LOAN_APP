const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/Gold_loan';

// MongoDB connection setup
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Mongoose model for admin collection
const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  password: { type: String, required: true },
  // Add other fields as needed
});

const Admin = mongoose.model('Admin', adminSchema);

// API route for user authentication
app.post('/api/login', async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminId, password });
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(admin); // Optionally, you can return admin data or a success message
  } catch (err) {
    console.error('Error authenticating admin:', err);
    res.status(500).json({ error: 'Error authenticating admin' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

