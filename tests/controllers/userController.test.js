const chai = require('chai');
const expect = chai.expect;
const userController = require('../../api/v1/user/userController');
require('../initdb');

describe('User controller test', () => {

  it('Should find user', (done) => {
    const username = 'Unit';
    userController.findUsers({username: username})
      .then(user => {
        expect(user[0].username).to.equal(username);
        done()
      })
      .catch(done);
  });

  it('Should create user', (done) => {
    const username = 'Test name';
    userController.createUser(username)
      .then((user) => {
        expect(user.username).to.equal(username);
        done();
      })
      .catch(done);
  })

});