const chai = require('chai');
const expect = chai.expect;
const userController = require('../../api/v1/user/userController');
const dbHelpers = require('../dbHelpers.js');

describe('User controller test', () => {

  beforeEach(done => dbHelpers.init(done));
  afterEach(done => dbHelpers.drop(done));

  it('Should find a user', (done) => {

    userController.findUser(mockUser)
      .then(user => {
        expect(user.firstName).to.equal(mockUser.firstName);
        expect(user.lastName).to.equal(mockUser.lastName);
        done()
      })
      .catch(done);
  });


  it('Should find users', (done) => {

    userController.findUsers(mockUser)
      .then(user => {
        expect(user[0].firstName).to.equal(mockUser.firstName);
        expect(user[0].lastName).to.equal(mockUser.lastName);
        done()
      })
      .catch(done);
  });

  it('Should create user', (done) => {
    const mockUser = {
      firstName: 'Test 2',
      lastName: 'Name2',
      email: 'test2@test.com',
      password: 'Test password',
      facebookId: 1,
      googleId: 2
    };

    userController.createUser(mockUser)
      .then((user) => {
        expect(user.firstName).to.equal(mockUser.firstName);
        expect(user.lastName).to.equal(mockUser.lastName);
        expect(user.facebookId).to.equal(1);
        expect(user.googleId).to.equal(2);
        expect(user.email).to.equal(mockUser.email);
        expect(user.validPassword('Test password')).to.be.true;
        done();
      })
      .catch(done);
  });

  describe('Should only accept password longer than 8', () => {
    const mockUser = {
      firstName: 'Test',
      lastName: 'Name',
      email: 'Test email',
      password: 'Test',
      facebookId: 1,
      googleId: 2
    };

    it('Throws an error', (done) => {
      userController.createUser(mockUser)
        .then(() => {
          done(new Error('Should throw an error'));
        })
        .catch((error) => {
          expect(error).to.be.ok;
          done();
        });
    });

    it('Should accept password', (done) => {
      mockUser.password = 'Longer p';
      userController.createUser(mockUser)
        .then((user) => {
          expect(user).to.be.ok;
          done();
        })
        .catch(done);
    });


  });

});