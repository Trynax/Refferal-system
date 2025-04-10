const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/users/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get referral stats
router.get('/users/:walletAddress/referrals', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get all the referred users
    const referredUsers = await User.find({ 
      walletAddress: { $in: user.referrals } 
    }).select('walletAddress createdAt');
    
    res.json({ 
      success: true, 
      referralCode: user.referralCode,
      referralLink: `${process.env.FRONTEND_URL || 'https://yourdomain.com'}?ref=${user.referralCode}`,
      referralCount: user.referrals.length,
      referredUsers
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/referral/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const referrer = await User.findOne({ referralCode: code });
    
    if (!referrer) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }
    
    res.json({ 
      success: true, 
      referrerWallet: referrer.walletAddress 
    });
  } catch (error) {
    console.error('Validate referral error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;