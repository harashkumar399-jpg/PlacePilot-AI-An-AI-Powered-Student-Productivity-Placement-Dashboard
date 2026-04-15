const express = require("express");
const router = express.Router();

// controller functions
const {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
} = require("../controllers/userController");

// middleware import
const protect = require("../middleware/authMiddleware");



//  PUBLIC ROUTES 

// user register karega (OTP send hoga)
router.post("/register", registerUser);

// OTP verify karega
router.post("/verify-otp", verifyOtp);

// OTP dobara bhejna
router.post("/resend-otp", resendOtp);

// login karega (token milega)
router.post("/login", loginUser);

//  PROTECTED ROUTE 

// ye route sirf tab chalega jab valid token hoga
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully",
    
    // middleware ne user id attach ki thi
    userId: req.user,
  });
});



// controller import
const { getUserProfile } = require("../controllers/userController");

// ================= PROTECTED PROFILE ROUTE =================

// ye route sirf tab chalega jab valid token hoga
// flow: request → middleware → controller
router.get("/profile", protect, getUserProfile);

module.exports = router;