const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var models = require('./models');
const app = express();

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

const v1Routes = require('./api/v1/user/routes');

app.use('/api/v1', v1Routes);

app.use((err, req, res, next) => {
  return res.status(500).send(err.toString());
});

module.exports = app;