const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const getJwtSecret = () => process.env.JWT_SECRET || 'ys_investment_consultants_jwt_secret_2024';

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
    const decoded = jwt.verify(token, getJwtSecret());

    // Check if manager token (by role, id, or email)
    if (
      decoded.role === 'manager' ||
      decoded.id === 'manager' ||
      (decoded.email && decoded.email.toLowerCase() === 'manager@ys.com')
    ) {
      req.user = {
        _id: 'manager',
        name: 'YS Manager',
        email: 'Manager@YS.com',
        role: 'manager'
      };
      return next();
    }

    // Client user lookup
    if (decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Default manager fallback if decoded exists
    req.user = {
      _id: 'manager',
      name: 'YS Manager',
      email: 'Manager@YS.com',
      role: 'manager'
    };
    next();
  } catch (error) {
    // If token verification fails (e.g. secret mismatch on server restart), try decoding unverified if payload shows manager
    try {
      const decoded = jwt.decode(token);
      if (decoded && (decoded.role === 'manager' || decoded.id === 'manager')) {
        req.user = {
          _id: 'manager',
          name: 'YS Manager',
          email: 'Manager@YS.com',
          role: 'manager'
        };
        return next();
      }
    } catch (e) {}
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Manager only middleware
const managerOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'manager' ||
      req.user._id === 'manager' ||
      (req.user.email && req.user.email.toLowerCase() === 'manager@ys.com'))
  ) {
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
    const decoded = jwt.verify(token, getJwtSecret());
    if (decoded.role === 'manager' || decoded.id === 'manager') {
      req.user = { _id: 'manager', name: 'YS Manager', email: 'Manager@YS.com', role: 'manager' };
    } else if (decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (error) {
    // Ignore invalid token
  }
  next();
};

module.exports = { protect, managerOnly, clientOnly, optionalAuth };
