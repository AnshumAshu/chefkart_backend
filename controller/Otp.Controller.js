const User = require('../model/Otp.Model');

// Store OTPs temporarily (in memory for demo purposes)
const otpMap = new Map();

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpMap.set(phone, otp);
  console.log(`OTP for ${phone}: ${otp}`);

  // In production, use Twilio or SMS API here

  res.json({ success: true, message: "OTP sent successfully" });
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = otpMap.get(phone);

  if (storedOtp === otp) {
    await User.findOneAndUpdate(
      { phone },
      { phone, verified: true },
      { upsert: true, new: true }
    );
    otpMap.delete(phone);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};
