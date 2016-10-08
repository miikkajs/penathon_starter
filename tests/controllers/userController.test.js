const chai = require('chai');
const expect = chai.expect;
const userController = require('../../api/v1/user/userController');
require('../initdb');

describe('User controller test', () => {

  it('Should find a user', (done) => {
    const name = {
      firstName: 'Unit',
      lastName: 'Test'
    };

    userController.findUser(name)
      .then(user => {
        expect(user.firstName).to.equal(name.firstName);
        expect(user.lastName).to.equal(name.lastName);
        done()
      })
      .catch(done);
  });


  it('Should find users', (done) => {
    const name = {
      firstName: 'Unit',
      lastName: 'Test'
    };
    
    userController.findUsers(name)
      .then(user => {
        expect(user[0].firstName).to.equal(name.firstName);
        expect(user[0].lastName).to.equal(name.lastName);
        done()
      })
      .catch(done);
  });

  it('Should create user', (done) => {
    const name = {
      firstName: 'Test',
      lastName: 'Name',
      facebookId: 1,
      googleId: 2
    };
    
    userController.createUser(name)
      .then((user) => {
        expect(user.firstName).to.equal(name.firstName);
        expect(user.lastName).to.equal(name.lastName);
        expect(user.facebookId).to.equal(1);
        expect(user.googleId).to.equal(2);
        done();
      })
      .catch(done);
  })

});