const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: String,
    default: null
  },
  referrals: [{
    type: String 
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  registeredTimestamp: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000)
  }
});

module.exports = mongoose.model('User', userSchema);