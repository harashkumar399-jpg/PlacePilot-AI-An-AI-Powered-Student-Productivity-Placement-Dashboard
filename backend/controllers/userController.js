// controllers/userController.js

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");


//  REGISTER 
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // 2. Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // 3. Strong password
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be strong",
      });
    }

    // 4. Check existing user
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // 7. If user exists but not verified → update
    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // 8. Create new user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
      });
    }

    // 9. Send OTP email
    await sendEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// VERIFY OTP 
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Activate account
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// RESEND OTP 
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    // New OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, otp);

    res.json({
      success: true,
      message: "OTP resent",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  registerUser,
  verifyOtp,
  resendOtp,
};