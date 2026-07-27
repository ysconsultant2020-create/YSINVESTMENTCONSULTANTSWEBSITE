const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's the manager (hardcoded)
    if (decoded.role === 'manager') {
      req.user = {
        _id: 'manager',
        name: 'YS Manager',
        email: 'Manager@YS.com',
        role: 'manager'
      };
    } else {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Manager only middleware
const managerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Manager only.' });
  }
};

// Client only middleware
const clientOnly = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Clients only.' });
  }
};

// Optional Auth - verifies token if present, but allows unauthenticated access
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'manager') {
      req.user = { _id: 'manager', name: 'YS Manager', email: 'Manager@YS.com', role: 'manager' };
    } else {
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (error) {
    // Ignore invalid token
  }
  next();
};

module.exports = { protect, managerOnly, clientOnly, optionalAuth };
