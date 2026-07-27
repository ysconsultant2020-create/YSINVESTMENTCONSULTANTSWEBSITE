const mongoose = require('mongoose');

const mutualFundSchema = new mongoose.Schema({
  fundName: {
    type: String,
    required: [true, 'Fund name is required'],
    trim: true
  },
  amc: {
    type: String,
    required: [true, 'AMC is required'],
    trim: true
  },
  riskLevel: {
    type: String,
    required: [true, 'Risk level is required'],
    enum: ['Low', 'Moderate', 'High', 'Very High']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  returns: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  minInvestment: {
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

module.exports = mongoose.model('MutualFund', mutualFundSchema);
