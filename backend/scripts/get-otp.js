require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

const email = process.argv[2] || 'e2e_test+2@example.com';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }
    console.log('User:', user.email);
    console.log('OTP:', user.otp);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
