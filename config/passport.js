require('lazy-ass');
var check = require('check-more-types');
var R = require('ramda');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var config = require('./');
var Users = require('../models/User')();

passport.serializeUser(function(user, done) {
  la(check.object(user), 'expected user object');
  la(check.fn(done), 'expected done callback');
  la(check.unemptyString(user.id || user.email),
    'expected user id or email to be a string', Object.keys(user));
  done(null, user.id || user.email);
});

passport.deserializeUser(function (idOrEmail, done) {
  la(check.unemptyString(idOrEmail), 'expected id or email', idOrEmail);

  Users.find(idOrEmail)
    .catch(function (err) {
      return Users.find({ email: idOrEmail })
        .then(R.head);
    })
    .then(function (user) {
      // useful helper methods
      user.gravatar = Users.gravatar;
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy(config.get('github'), function(req, accessToken, refreshToken, profile, done) {
  console.log('passport.use github profile', profile.id);
  if (req.user) {
    console.log('existing user');
    throw new Error('not implemented');

    Users.findOne({ github: profile.id }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken: accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile._json.avatar_url;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.website = user.profile.website || profile._json.blog;
          user.save(function(err) {
            req.flash('info', { msg: 'GitHub account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    console.log('no user logged in yet');

    Users.find({ github: profile.id })
      .then(function (existingUsers) {
        // console.log('existing user?', existingUsers.length);

        if (existingUsers.length) {
          return done(null, existingUsers[0]);
        }

        var tokens = [{
          kind: 'github',
          accessToken: accessToken
        }];

        var userProfile = {
          name: profile.displayName,
          picture: profile._json.avatar_url,
          location: profile._json.location,
          website: profile._json.blog
        };

        var user = Users.new({
          email: profile._json.email,
          github: profile.id,
          tokens: tokens,
          profile: userProfile
        });

        console.log('saving new user');
        Users.store(user)
          .then(function (response) {
            console.log('saved user', user.email);
            // console.log('response', response);
            return done(null, user);
          });
      })
      .catch(function (err) {
        console.log('could not find user by github', profile.id);
        console.error(err);
      });
  }
}));


/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (R.find(R.propEq('kind', provider), req.user.tokens)) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};
