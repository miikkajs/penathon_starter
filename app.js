const express = require('express');
const path = require('path');
const glob = require('glob');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passportConfig = require('./config/passport');
const userController = require('./api/v1/user/userController');

const passport = require('passport');

var models = require('./models');

const app = express();

const store = new SequelizeStore({
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


if (!isAnyCredentialAvailable()) {
  throw new Error('You can\'t init passport without any credentials!');
}

if (checkFacebookCredentials()) {
  passportConfig.initFacebookStrategy(app);
}

if (checkGoogleCredentials()) {
  passportConfig.initGoogleStrategy(app);
}


app.use((err, req, res, next) => {
  return res.status(500).send(err.toString());
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  return res.status(200).send();
});

app.get('/app', passportConfig.isAuthenticated, (req, res) => {
  return res.redirect('/welcome.html');
});


module.exports = app;

function checkFacebookCredentials() {
  return !!process.env.FACEBOOK_ID && !!process.env.FACEBOOK_SECRET
}

function checkGoogleCredentials() {
  return !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
}

function isAnyCredentialAvailable() {
  return checkFacebookCredentials() || checkGoogleCredentials();
}