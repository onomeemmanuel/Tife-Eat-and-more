const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  register,
  verifyOTP,
  resendOTP,
  login,
  getMe,
  logout,
  googleCallback
} = require('../controllers/auth.controller');
const protect = require('../middleware/middleware');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5174'}/login`, session: false }),
  googleCallback
);

module.exports = router;