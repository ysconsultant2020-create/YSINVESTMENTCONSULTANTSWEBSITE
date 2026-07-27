const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Manager hardcoded credentials
const MANAGER_EMAIL = 'Manager@YS.com';
const MANAGER_PASSWORD = 'YS@1997';

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register client
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, city } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      city,
      role: 'client'
    });

    const token = generateToken({ id: user._id, role: 'client' });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login (both manager and client)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if it's manager
    if (email.toLowerCase() === MANAGER_EMAIL.toLowerCase() && password === MANAGER_PASSWORD) {
      const token = generateToken({ id: 'manager', role: 'manager' });
      return res.json({
        token,
        user: {
          _id: 'manager',
          name: 'YS Manager',
          email: MANAGER_EMAIL,
          role: 'manager'
        }
      });
    }

    // Client login
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
