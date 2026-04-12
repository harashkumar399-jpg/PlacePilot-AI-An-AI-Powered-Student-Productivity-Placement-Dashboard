const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOtp,
  resendOtp,
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

module.exports = router;