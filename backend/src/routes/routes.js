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

const resolveGoogleCallbackURL = (req) => {
  if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;

  const host = req.get('x-forwarded-host') || req.get('host');
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http';

  if (host) {
    return `${proto}://${host}/api/auth/google/callback`;
  }

  return 'http://localhost:5000/api/auth/google/callback';
};

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);

// Google OAuth
router.get('/google', (req, res, next) => {
  const callbackURL = resolveGoogleCallbackURL(req);
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    callbackURL
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  const callbackURL = resolveGoogleCallbackURL(req);
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5174'}/login`,
    session: false,
    callbackURL
  })(req, res, next);
}, googleCallback);

module.exports = router;