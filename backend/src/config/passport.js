const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

console.log('Google OAuth callback URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('Google OAuth client ID present:', Boolean(process.env.GOOGLE_CLIENT_ID));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Check if email already exists (signed up manually before)
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link Google to existing account
        user.googleId = profile.id;
        user.isVerified = true;
        user.avatar = profile.photos[0].value;
        await user.save();
      } else {
        // Brand new user via Google
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0].value,
          isVerified: true
        });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});