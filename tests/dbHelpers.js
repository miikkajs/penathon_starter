const models = require('../models/');

const user = {
  email: 'test@test.com',
  firstName: 'Unit',
  lastName: 'Test'
};

const init = (done) => {
  models.sequelize.sync()
    .then(() =>
      models.User.create(user)
    )
    .then(() => {
      done();
    })
    .catch(done)
};


const drop = (done) => {
  models.sequelize.drop()
    .then(() => {
      return done()
    });
}


module.exports = {
  user: user,
  init: init,
  drop: drop
};