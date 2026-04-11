const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // extra spaces hata deta hai
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // email lowercase me store hoga
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  googleId: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);