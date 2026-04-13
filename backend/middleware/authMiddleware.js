const jwt = require("jsonwebtoken");

// AUTH MIDDLEWARE
const protect = (req, res, next) => {
  try {
    // 1. Authorization header se token lena
    // format: "Bearer TOKEN"
    const authHeader = req.headers.authorization;

    // 2. agar token nahi mila
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided", // user ne login nahi kiya
      });
    }

    // 3. "Bearer TOKEN" me se sirf TOKEN extract karna
    const token = authHeader.split(" ")[1];

    // 4. JWT token verify karna (secret key se)
    // agar invalid hua → error throw hoga
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. decoded token se user id nikaal ke request me attach karna
    // taaki next controller me use kar sake
    req.user = decoded.id;

    // 6. sab sahi hai → next function ko call karo
    next();

  } catch (error) {
    // agar token galat / expired hai
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;