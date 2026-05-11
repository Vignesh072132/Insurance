const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  documents: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  claimAmount: {
    type: Number,
    required: [true, 'Claim amount is required'],
    min: 0
  },
  rejectionReason: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, { timestamps: true });

claimSchema.pre('save', async function() {
  if (!this.claimNumber) {
    this.claimNumber = 'CLM' + Date.now() + Math.floor(Math.random() * 1000);
  }
});

module.exports = mongoose.model('Claim', claimSchema);
