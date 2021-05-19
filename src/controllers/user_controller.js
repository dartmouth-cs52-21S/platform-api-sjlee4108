import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

// returns token for the given user
export const signin = (user) => {
  return tokenForUser(user);
};

// creates a new user based on given email and password
export const signup = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('You must provide email and password');
  }

  // See if a user with the given email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If a user with email does exist, return an error
    throw new Error('Email is in use');
  }

  // create user instance and save the user
  // returns the token for that user
  const user = new User();
  user.email = email;
  user.password = password;
  await user.save();
  return tokenForUser(user);
};

// token
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
