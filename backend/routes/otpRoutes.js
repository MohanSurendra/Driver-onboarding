const express = require('express');
const router = express.Router();

let aadhaarStore = {}; // in-memory storage

// Step 1: Send OTP
router.post('/generate-otp', (req, res) => {
  const { aadhaar } = req.body;

  if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
    return res.status(400).json({ message: 'Invalid Aadhaar number' });
  }

  aadhaarStore[aadhaar] = '123456'; // mock OTP
  res.json({ message: 'OTP sent to registered mobile (mocked)' });
});

// Step 2: Verify OTP
router.post('/verify-otp', (req, res) => {
  const { aadhaar, otp } = req.body;

  if (aadhaarStore[aadhaar] === otp) {
    delete aadhaarStore[aadhaar]; // OTP is single-use
    return res.json({ message: 'OTP verified successfully' });
  }

  return res.status(401).json({ message: 'Invalid OTP' });
});

module.exports = router;
