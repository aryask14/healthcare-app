const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role, // 'admin', 'doctor', 'patient'
    },
    config.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Verify JWT token (middleware)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Attach user data to request
    next();
  });
};

// Role-based access control
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

module.exports = { generateToken, verifyToken, checkRole };