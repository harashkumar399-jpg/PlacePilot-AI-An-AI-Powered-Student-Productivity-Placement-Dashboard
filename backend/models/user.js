// Import mongoose (MongoDB schema banane ke liye)
const mongoose = require("mongoose");

// User schema define kar rahe hain (structure of data)
const userSchema = new mongoose.Schema({

  // User ka naam
  name: {
    type: String,
    required: true, // must field
  },

  // User ka email
  email: {
    type: String,
    required: true,
    unique: true, // duplicate email allow nahi karega
  },

  // Password (hashed store hoga)
  password: {
    type: String,
    required: true,
    minlength: 6, // minimum length
  },

  // Login provider (normal ya google)
  provider: {
    type: String,
    enum: ["local", "google"], // sirf ye values allowed
    default: "local",
  },

  // Google login ke liye id
  googleId: {
    type: String,
  },

  // Email verify hua ya nahi
  isVerified: {
    type: Boolean,
    default: false, // by default false (OTP ke baad true hoga)
  },

  // OTP store karne ke liye
  otp: {
    type: String,
  },

  // OTP expiry time (security ke liye)
  otpExpiry: {
    type: Date,
  },

  // ================= CODING USERNAMES =================

// LeetCode username
leetcode: {
  type: String,
  default: null,
},

// Codeforces username
codeforces: {
  type: String,
  default: null,
},

// CodeChef username
codechef: {
  type: String,
  default: null,
},

// HackerRank username
hackerrank: {
  type: String,
  default: null,
},

}, { 
  timestamps: true // createdAt & updatedAt auto add karega
});

// Model create kar rahe hain (User collection banega DB me)
module.exports = mongoose.model("User", userSchema);