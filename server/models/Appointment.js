const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['Insurance', 'Mutual Fund', 'SIP', 'Lumpsum', 'Wealth Planning', 'Wealth Creation']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required']
  },
  productName: {
    type: String,
    default: ''
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  preferredDate: {
    type: String,
    required: [true, 'Preferred date is required']
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required']
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
