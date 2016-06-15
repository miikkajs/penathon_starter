const models = require('../models/');

beforeEach((done) => {
  models.sequelize.sync()
    .then(() => {
      return models.User.create({username: 'Unit'})
    })
    .then(() => {
        done();
    })
    .catch(done)
});

afterEach((done) => {
  models.sequelize.drop()
    .then(() => done());
})


