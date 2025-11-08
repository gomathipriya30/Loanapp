// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// This middleware protects routes
function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid.' });
  }
}

// This middleware checks for admin role
function adminAuth(req, res, next) {
  // We assume auth() middleware has run before this
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Not an admin.' });
  }
  next();
}

module.exports = { auth, adminAuth };