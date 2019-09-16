/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import models from '../database/models';

const {
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL,
  FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_CALLBACK_URL,
} = process.env;

export default () => {
  const { User } = models;

  // find or create user
  const processData = (email, firstName, lastName, password, done) => {
    User
      .findOrCreate({
        where: { email },
        defaults: { firstName, lastName, password }
      })
      .then(([user, created]) => {
        const data = user.get({
          plain: true
        });

        return done(null, data);
      })
      .catch(err => done(err, null));
  };

  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  }, (accessToken, refreshToken, profile, done) => {
    const { _json: { given_name, family_name, email } } = profile;
    processData(email, given_name, family_name, accessToken, done);
  }));

  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name']
  }, (accessToken, refreshToken, profile, done) => {
    const { emails, name: { givenName, familyName } } = profile;
    processData(emails[0].value, givenName, familyName, accessToken, done);
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
