'use strict';

const
  passport = require('passport'),
  config = require('../config'),
  h = require('../helpers'),
  logger = require('../logger'),
  FacebookStrategy = require('passport-facebook').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy;


module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // Find the user with _id
    h.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        logger.log('error', 'Error when deserializing the user' + error);
      });
  });
  // For Twitter: token, tokenSecret
  let authProcessor = (accessToken, refreshToken, profile, done) => {
    // Find a user in the local db using profile.id
    h.findOne(profile.id)
      .then((result) => {
        if (result) {
          done(null, result);
        } else {
          // Create a new user and return
          h.createNewUser(profile)
            .then((newChatUser) => {
              done(null, newChatUser);
            })
            .catch((error) => {
              looger.log('error', 'Error when creating new user' + error);
            });
        }
      });
    // If the user is found, return the user data using the done()
    // If the user is not found, create on in the local db and return
  };

  passport.use(new FacebookStrategy(config.fb, authProcessor));
  passport.use(new TwitterStrategy(config.twitter, authProcessor));
};