const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.set('port', process.env.PORT || 3000);


app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});


app.use(express.static(path.join(__dirname, 'public')));

const v1Routes = require('./api/v1/routes');

app.use('/api/v1', v1Routes);

module.exports = app;