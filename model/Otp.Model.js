const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  name: String,
  phone: String,
  otp: String,
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('otp', otpSchema);
