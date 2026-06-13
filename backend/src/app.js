const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

require('./config/passport');

const authRoutes = require('./routes/routes');
const foodRoutes = require('./routes/food.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177'
].filter(Boolean);
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

// Serve frontend static files if they exist (single-service deployment)
const frontendDist = path.join(__dirname, '../../frontend/dist');
const frontendExists = fs.existsSync(frontendDist);
console.log('frontendDist path:', frontendDist);
console.log('frontendDist exists:', frontendExists);
if (frontendExists) {
  console.log('Serving frontend static files from frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    // Let API routes continue to next handler
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  console.warn('frontend/dist not found; serving backend placeholder response.');
  app.get('/', (req, res) => {
    res.send('Tife Eat and more API is running');
  });
}

// Error logging middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

module.exports = app;