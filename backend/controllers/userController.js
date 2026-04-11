
// Import User model (DB interaction ke liye)
const User = require("../models/user");

// Import bcrypt (password hashing ke liye)
const bcrypt = require("bcryptjs");

// Import validator (email validation ke liye)
const validator = require("validator");

// Register user controller (main logic yahi hai)
const registerUser = async (req, res) => {
  try {
    // 1. Client se data lena (body se)
    const { name, email, password } = req.body;

    // 2. Check: sab fields aaye ya nahi
    // Agar koi field missing hai to error return
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 3. Email validation
    // Check karta hai email valid format me hai ya nahi
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 4. Password strength check
    // At least 6 characters + letters + numbers hone chahiye
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters and include letters and numbers",
      });
    }

    // 5. Duplicate user check
    // Same email pe already account hai ya nahi
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 6. Password hashing
    // Salt generate karta hai (security ke liye)
    const salt = await bcrypt.genSalt(10);

    // Password ko hash karta hai
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. New user create karna (DB me save)
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // hashed password store kar rahe hain
    });

    // 8. Success response bhejna
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    // 9. Agar koi error aaye to handle karna
    console.error(error); // console me print (debugging ke liye)

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Export controller function
module.exports = { registerUser };