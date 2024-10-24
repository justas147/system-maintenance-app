import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import UserData from '../modules/users/UsersData';
import { HttpError } from '../core/errorHandler';

// Local strategy for username/password
passport.use(new LocalStrategy(
  async (username: string, password: string, done: any) => {
    try {
      const user = await UserData.findByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!user.password) {
        throw new HttpError(400, "User password not set")
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    const existingUser = await UserData.findByGoogleId(profile.id);

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await UserData.create({
      googleId: profile.id,
      email: profile.emails ? profile.emails[0].value : '',
      name: profile.displayName
    });

    return done(null, newUser);
  } catch (err) {
    return done(err, false);
  }
}));

// Serialize user (used for sessions)
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await UserData.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});