const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');

const verifyCallback = async(username, password, done) => {
    try{
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        /*
        We will use the bcrypt.compare() function to validate the password input. The function compares the plain-text password in the request object to the hashed password.
        */
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
    } catch(err) {
        return done(err);
    }
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id); // Note: user.id is a virtual getter provided by mongoose which returns the document’s _id field cast to a string.
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
});