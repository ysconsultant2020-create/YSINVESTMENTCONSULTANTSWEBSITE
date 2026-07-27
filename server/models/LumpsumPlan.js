const mongoose = require('mongoose');

const lumpsumPlanSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
  },
  minAmount: {
    type: String,
    required: [true, 'Minimum investment amount is required']
  },
  expectedReturns: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    required: [true, 'Investment duration is required']
  },
  risk: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Very High'],
    default: 'Moderate'
  },
  description: {
    type: String,
    required: [true, 'Description is required']
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

module.exports = mongoose.model('LumpsumPlan', lumpsumPlanSchema);
