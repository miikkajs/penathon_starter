const userController = require('../api/v1/user/userController');
const FacebookStrategy = require('passport-facebook').Strategy;
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

module.exports = {
  isAuthenticated: isAuthenticated,
  initFacebookStrategy: initFacebookStrategy
};

