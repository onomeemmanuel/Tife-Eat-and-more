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
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL || (process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/api/auth/google/callback` : process.env.RENDER_EXTERNAL_URL ? `${process.env.RENDER_EXTERNAL_URL}/api/auth/google/callback` : 'http://localhost:5000/api/auth/google/callback');

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    callbackURL: googleCallbackURL
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5174'}/login`,
    session: false,
    callbackURL: googleCallbackURL
  }),
  googleCallback
);

module.exports = router;