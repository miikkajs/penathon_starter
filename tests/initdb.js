const models = require('../models/');

beforeEach((done) => {
  models.sequelize.sync()
    .then(() =>
      models.User.create({
        firstName: 'Unit',
        lastName: 'Test'
      })
    )
    .then(() => {
      done();
    })
    .catch(done)
});

afterEach((done) => {
  models.sequelize.drop()
    .then(() => done());
});


