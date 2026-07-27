const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Health Insurance', 'Motor Insurance', 'Non-Motor Insurance', 'ICICI Insurance']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  benefits: {
    type: String,
    default: ''
  },
  premium: {
    type: String,
    default: ''
  },
  coverage: {
    type: String,
    default: ''
  },
  features: {
    type: String,
    default: ''
  },
  eligibility: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Insurance', insuranceSchema);
