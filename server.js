const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Login = require('./models/Login');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  const loginData = new Login({ email, timestamp: new Date() });
  await loginData.save();

  // Send email to admin
  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: 'New User Login',
    text: `User with email ${email} logged in at ${loginData.timestamp}`
  });

  res.json({ success: true, message: 'Login recorded and admin notified.' });
});

// Admin panel endpoint
app.get('/admin/logins', async (req, res) => {
  const logins = await Login.find().sort({ timestamp: -1 });
  let html = '<h2>Login Events</h2><ul>';
  logins.forEach(l => {
    html += `<li>${l.email} - ${l.timestamp}</li>`;
  });
  html += '</ul>';
  res.send(html);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 