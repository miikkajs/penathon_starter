const express = require('express');
const path = require('path');
const glob = require('glob');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passportConfig = require('./config/passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const userController = require('./api/v1/user/userController');

const passport = require('passport');

var models = require('./models');

const app = express();

const store =  new SequelizeStore({
  db: models.sequelize
});

app.use(cookieParser());
app.use(session({
  secret: 'p3n47h0n',
  resave: false,
  saveUninitialized: false,
  store: store
}));

store.sync();

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

app.set('port', process.env.PORT || 3000);

models.sequelize.sync().then(() => {
  app.listen(app.get('port'), () => {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
  });
});


app.use(express.static(path.join(__dirname, 'public')));


const loadRoutes = () => {
  const v1Routes = './api/v1/**/routes.js';

  glob.sync(v1Routes).forEach((file) => {
    let route = require(path.resolve(file));
    app.use('/api/v1', route);
  });
};

loadRoutes();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return userController.findUser({
      id: id
    })
    .then(user => done(null, user.dataValues))
    .catch(done);
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
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


app.use((err, req, res, next) => {
  return res.status(500).send(err.toString());
});

app.get('/logout',(req, res) => {
  req.session.destroy();
  return res.status(200).send();
});

app.get('/app', passportConfig.isAuthenticated, (req, res) => {
  return res.redirect('/welcome.html');
});



module.exports = app;