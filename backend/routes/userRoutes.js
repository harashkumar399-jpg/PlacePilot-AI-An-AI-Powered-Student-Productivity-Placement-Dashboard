const express = require("express");
const router = express.Router();

// ================= CONTROLLERS IMPORT =================
const {
  registerUser,     // user registration
  verifyOtp,        // otp verify
  resendOtp,        // resend otp
  loginUser,        // login + token
  getUserProfile,   // profile data
  getDashboard,     // dashboard data
  updatePlatforms,
  getLeetcodeStats
} = require("../controllers/userController");

// ================= MIDDLEWARE IMPORT =================
const protect = require("../middleware/authMiddleware");


// =====================================================
// PUBLIC ROUTES (token nahi chahiye)
// =====================================================

// Register new user
router.post("/register", registerUser);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

// Login user
router.post("/login", loginUser);


// =====================================================
// PROTECTED ROUTES (token chahiye)
// =====================================================

// User Profile
router.get("/profile", protect, getUserProfile);

// User Dashboard
router.get("/dashboard", protect, getDashboard);

// update coding platform usernames
router.put("/platforms", protect, updatePlatforms);

// fetch leetcode stats
router.get("/leetcode-stats", protect, getLeetcodeStats);


// export router
module.exports = router;