import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import User from '../models/user_model';

// loads in .env file if needed
dotenv.config({ silent: true });

// options for local strategy, we'll use email AS the username
const localOptions = { usernameField: 'email' };

// options for jwt strategy
// we'll pass in the jwt in an `authorization` header
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.AUTH_SECRET,
};

// username/email + password authentication strategy
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  // should find user by email and check password
  User.findOne({ email }, (err, user) => {
    // has an error
    if (err) { return done(err); }
    // user does not exisi
    if (!user) { return done(null, false); }
    // user provided wrong password
    if (!user.comparePassword(password)) { return done(null, false); }

    // correct match of username and password, completed log in
    return done(null, user);
  });
});

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  console.log(payload);
  User.findById(payload.sub, (err, user) => {
    // error
    if (err) {
      return done(err, false);
    }
    // user exists
    if (user) {
      return done(null, user);
    } else {
      // user does not exist
      return done(null, false);
    }
  });
});

// set these strategies for passport
passport.use(jwtLogin);
passport.use(localLogin);

// middleware functions to use in routes
export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
