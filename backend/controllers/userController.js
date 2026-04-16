// controllers/userController.js

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const axios = require("axios");


// ======================================================
// REGISTER USER
// ======================================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // all fields required
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // valid email check
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    // strong password check
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be strong",
      });
    }

    // existing user check
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP valid for 5 min
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // old unverified user update
    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiry = otpExpiry;

      await user.save();
    } else {
      // create new user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
      });
    }

    // send OTP mail
    await sendEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// VERIFY OTP
// ======================================================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // OTP wrong or expired
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // verify account
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// RESEND OTP
// ======================================================
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    // generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, otp);

    res.json({
      success: true,
      message: "OTP resent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// LOGIN USER
// ======================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // fields required
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // email verified check
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // password compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ======================================================
// GET PROFILE
// ======================================================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ======================================================
// UPDATE PLATFORM USERNAMES
// ======================================================
const updatePlatforms = async (req, res) => {
  try {
    const userId = req.user;

    const {
      leetcode,
      codeforces,
      codechef,
      hackerrank
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        leetcode,
        codeforces,
        codechef,
        hackerrank,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Platforms updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// GET LEETCODE STATS
// ======================================================
const getLeetcodeStats = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user || !user.leetcode) {
      return res.status(400).json({
        success: false,
        message: "LeetCode username not found",
      });
    }

    const response = await axios.get(
      `https://leetcode-stats-api.herokuapp.com/${user.leetcode}`
    );

    res.status(200).json({
      success: true,
      message: "LeetCode stats fetched successfully",
      username: user.leetcode,
      data: response.data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch LeetCode stats",
    });
  }
};


// ======================================================
// DASHBOARD
// ======================================================
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // default codeforces stats
let codeforcesStats = null;

// agar username saved hai
if (user.codeforces) {
  try {
    const cfResponse = await axios.get(
      `https://codeforces.com/api/user.info?handles=${user.codeforces}`
    );

    const data = cfResponse.data.result[0];

    codeforcesStats = {
      username: data.handle,
      rating: data.rating || 0,
      maxRating: data.maxRating || 0,
      rank: data.rank || "unrated",
      maxRank: data.maxRank || "unrated",
      contribution: data.contribution,
      source: "official api"
    };

  } catch (error) {
    codeforcesStats = {
      username: user.codeforces,
      error: "Unable to fetch Codeforces stats"
    };
  }
}

// default codechef stats
let codechefStats = null;

// agar username saved hai
if (user.codechef) {
  try {
    const ccResponse = await axios.get(
  `https://codechef-api.vercel.app/handle/${encodeURIComponent(user.codechef)}`
);
    codechefStats = {
      username: user.codechef,
      rating: ccResponse.data.currentRating || 0,
      highestRating: ccResponse.data.highestRating || 0,
      stars: ccResponse.data.stars || 0,
      globalRank: ccResponse.data.globalRank || 0,
      countryRank: ccResponse.data.countryRank || 0,
      source: "public api"
    };

  } catch (error) {
    codechefStats = {
  username: user.codechef,
  connected: true,
  message: "CodeChef profile linked successfully",
  statsStatus: "temporarily unavailable"
  };
  }
}

    let leetcodeStats = null;

    // fetch live leetcode data
    // agar username saved hai tab fetch karo
if (user.leetcode) {
  try {
    // ================= PRIMARY API =================
    const response = await axios.get(
      `https://leetcode-stats-api.herokuapp.com/${user.leetcode}`,
      { timeout: 5000 }
    );

    leetcodeStats = {
      username: user.leetcode,
      totalSolved: response.data.totalSolved,
      easySolved: response.data.easySolved,
      mediumSolved: response.data.mediumSolved,
      hardSolved: response.data.hardSolved,
      ranking: response.data.ranking,
      acceptanceRate: response.data.acceptanceRate,
      source: "primary api"
    };

  } catch (error) {

    try {
      // ================= BACKUP API =================
      const backup = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${user.leetcode}`,
        { timeout: 7000 }
      );

      leetcodeStats = {
        username: user.leetcode,
        totalSolved: backup.data.totalSolved,
        easySolved: backup.data.easySolved,
        mediumSolved: backup.data.mediumSolved,
        hardSolved: backup.data.hardSolved,
        ranking: backup.data.ranking,
        source: "backup api"
      };

    } catch (error2) {

      // final fallback
      leetcodeStats = {
        username: user.leetcode,
        error: "Unable to fetch stats from all sources"
      };
    }
  }
}

    res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",

      data: {
        welcomeMessage: `Welcome back, ${user.name}`,

        profile: {
          name: user.name,
          email: user.email,
          verified: user.isVerified,
        },

        stats: {
          totalSolved: 0,
          activeDays: 0,
          streak: 0,
          rating: 0,
        },

        platforms: {
          leetcode: user.leetcode,
          codeforces: user.codeforces,
          codechef: user.codechef,
          hackerrank: user.hackerrank,
        },

        liveStats: {
          leetcode: leetcodeStats,
          codeforces: codeforcesStats,
          codechef: codechefStats
        },
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================
module.exports = {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  getUserProfile,
  updatePlatforms,
  getLeetcodeStats,
  getDashboard,
};