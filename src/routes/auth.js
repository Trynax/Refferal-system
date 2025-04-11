const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

function generateReferralCode(walletAddress) {
  const hash = crypto.createHash('sha256');
  hash.update(walletAddress + Date.now().toString());
  return hash.digest('hex').substring(0, 8);
}


router.post('/wallet', async (req, res) => {
  try {
    const { walletAddress, referralCode } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (user) {
      return res.json({ 
        success: true, 
        user, 
        message: 'User logged in successfully' 
      });
    }
    

    const newReferralCode = generateReferralCode(walletAddress);
    

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer.walletAddress;
        
     
        await User.updateOne(
          { walletAddress: referrer.walletAddress },
          { $addToSet: { referrals: walletAddress.toLowerCase() } }
        );
      }
    }
    

    user = new User({
      walletAddress: walletAddress.toLowerCase(),
      referralCode: newReferralCode,
      referredBy,
      registeredTimestamp: Math.floor(Date.now() / 1000)
    });
    
    await user.save();
    
    res.status(201).json({ 
      success: true, 
      user, 
      message: 'User create successfully' 
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;