const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(
  new localStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        console.log("Received credentials:", email, password);

        const user = await User.findOne({ email });
        if (!user) {
          console.log("User not found");
          return done(null, false, { message: 'Incorrect email' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (isPasswordMatch) {
          console.log("Authentication successful");
          return done(null, user);
        } else {
          console.log("Incorrect password");
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;