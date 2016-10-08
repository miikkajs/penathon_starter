const userController = require('../api/v1/user/userController');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local');
const passport = require('passport');

const isAuthenticated = (req, res, next) =>
  req.user ? next() : res.status(403).send();

const initFacebookStrategy = (app, clientID = process.env.FACEBOOK_ID, clientSecret = process.env.FACEBOOK_SECRET) => {
  passport.use(new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: '/login/facebook/return',
    profileFields: ['name', 'email'],
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    return userController.findUser({
      facebookId: profile._json.id
    }).then(user => {
      if (user) {
        return Promise.resolve(user);
      } else {
        return userController.createUser({
          firstName: profile._json.first_name,
          lastName: profile._json.last_name,
          facebookId: profile._json.id
        })
      }
    }).then((user) => done(null, user.dataValues))
      .catch(done);
  }));

  app.get('/login/facebook',
    passport.authenticate('facebook'));

  app.get('/login/facebook/return',
    passport.authenticate('facebook', {failureRedirect: '/'}),
    (req, res) => {
      return req.session.save(() => {
        return res.redirect('/app')
      });
    });

};

const initGoogleStrategy = (app, clientId = process.env.GOOGLE_CLIENT_ID, clientSecret = process.env.GOOGLE_CLIENT_SECRET) => {

  passport.use(new GoogleStrategy({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: '/login/google/return'
    },
    (accessToken, refreshToken, profile, done) => {
      return userController.findUser({
        googleId: profile.id
      }).then(user => {
        if (user) {
          return Promise.resolve(user);
        } else {
          return userController.createUser({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            googleId: profile.id
          })
        }
      }).then((user) => done(null, user.dataValues))
        .catch(done);
    }
  ));

  app.get('/login/google',
    passport.authenticate('google', {scope: ['profile']}));

  app.get('/login/google/return',
    passport.authenticate('google', {failureRedirect: '/login'}),
    (req, res) => {
      return req.session.save(() => {
        return res.redirect('/app')
      });
    });
};

const initLocalStrategy = (app) => {
  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function (email, password, done) {
      userController.findUser({email: email})
        .then((user) => {
          if (!user) {
            return done(null, false);
          }
          if (!user.validPassword(password)) {
            return done(null, false);
          }
          return done(null, user);
        }).catch(done);
    }
  ));

  app.post('/login/local', passport.authenticate('local', {
    failureRedirect: '/'
  }), (req, res) => {
    return req.session.save(() => {
      return res.redirect('/app')
    });
  });

};

module.exports = {
  isAuthenticated: isAuthenticated,
  initFacebookStrategy: initFacebookStrategy,
  initGoogleStrategy: initGoogleStrategy,
  initLocalStrategy: initLocalStrategy
};

