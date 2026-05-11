const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyNumber: {
    type: String,
    unique: true
  },
  policyType: {
    type: String,
    required: [true, 'Policy type is required'],
    enum: ['Health', 'Life', 'Vehicle', 'Property', 'Travel', 'Home', 'Business', 'Pet', 'Dental', 'Vision']
  },
  premium: {
    type: Number,
    default: 0,
    min: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  coverageAmount: {
    type: Number,
    required: [true, 'Coverage amount is required'],
    min: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

policySchema.pre('save', async function() {
  if (!this.policyNumber) {
    this.policyNumber = 'POL' + Date.now() + Math.floor(Math.random() * 1000);
  }
});

module.exports = mongoose.model('Policy', policySchema);
