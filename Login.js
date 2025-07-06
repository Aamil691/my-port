const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Login', LoginSchema); 