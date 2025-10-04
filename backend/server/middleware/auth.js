const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "your-secret-key-change-this-in-production",
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

// Protect routes - Verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Please login.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
    );

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token is invalid.",
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is deactivated.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or has expired. Please login again.",
      error: error.message,
    });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Export generateToken for use in auth routes
exports.generateToken = generateToken;
