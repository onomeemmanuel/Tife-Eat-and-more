const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const generateOTP = require('../utils/generateOTP');

// Generate JWT
const signToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn
  });
};

// Send JWT as cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified
    }
  });
};

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const { otp, expiresAt } = generateOTP();

    const user = await User.create({
      name,
      email,
      password,
      otp: { code: otp, expiresAt }
    });

    // Send OTP email asynchronously so request doesn't hang if mail transport is slow
    (async () => {
      try {
        console.log('Attempting to send OTP email to', email);
        await sendEmail({
          to: email,
          subject: 'Tife Eat and more — Verify your email',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto">
              <h2 style="color:#e85d24">Welcome to Tife Eat and more! 🍔</h2>
              <p>Hi ${name}, use this code to verify your account:</p>
              <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#e85d24;margin:24px 0">
                ${otp}
              </div>
              <p style="color:#888">This code expires in 10 minutes.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('OTP email failed to send:', emailErr.message, 'email=', email);
      }
    })();

    const responsePayload = {
      success: true,
      message: 'Account created! Check your email for the verification code.',
      userId: user._id
    };

    // For testing only: return OTP in response when explicitly enabled via env var
    if (process.env.RETURN_OTP_FOR_TESTING === 'true') {
      responsePayload.otp = otp;
    }

    res.status(201).json(responsePayload);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Account already verified' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully. Please sign in to continue.',
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { otp, expiresAt } = generateOTP();
    user.otp = { code: otp, expiresAt };
    await user.save();

    // Send OTP email asynchronously to avoid blocking
    (async () => {
      try {
        console.log('Attempting to resend OTP email to', user.email);
        await sendEmail({
          to: user.email,
          subject: 'Tife Eat and more — New verification code',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto">
              <h2 style="color:#e85d24">New verification code</h2>
              <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#e85d24;margin:24px 0">
                ${otp}
              </div>
              <p style="color:#888">This code expires in 10 minutes.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Resend OTP failed:', emailErr.message, 'email=', user.email);
      }
    })();

    res.json({ success: true, message: 'New OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
        userId: user._id
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @POST /api/auth/logout
exports.logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

// @GET /api/auth/google/callback — handled by passport, then:
exports.googleCallback = (req, res) => {
  const token = signToken(req.user._id);

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  // Build a safe redirect URL. Prefer explicit CLIENT_URL, otherwise infer from request headers.
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.headers.host || req.get('host');
  const base = process.env.CLIENT_URL || `${proto}://${host}`;
  const redirectUrl = `${base}/?token=${token}`;
  console.log('googleCallback redirect to:', redirectUrl);
  res.redirect(redirectUrl);
};

