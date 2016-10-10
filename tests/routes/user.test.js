let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
chai.use(chaiHttp);
const expect = chai.expect;
const dbHelpers = require('../dbHelpers.js');

describe.only('User route tests', () => {
  const dbUser = dbHelpers.user;

  beforeEach(done => dbHelpers.init(done));
  afterEach(done => dbHelpers.drop(done));

  const mockUser = {
    firstName: 'Test',
    lastName: 'Name',
    email: 'test@email.com',
    password: 'Test password'
  };

  it('Should post user', (done) => {
    chai.request(app)
      .post('/api/v1/user')
      .send(mockUser)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.contains({
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
        });
        done()
      })
      .catch(done);
  });

  it('Should login', (done) => {
    chai.request(app)
      .post('/login/local')
      .send(mockUser)
      .then(res => {
        expect(res).to.have.status(200);
        done()
      })
      .catch(done);
  });

  it('Should get user', (done) => {
    app.request.user = {id: 1};
    chai.request(app)
      .get('/api/v1/user')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.contains({
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName
        });
        done()
      })
      .catch(done);
  });

  it('Should get users', (done) => {
    app.request.user = {id: 1};
    chai.request(app)
      .get('/api/v1/users')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body[0]).to.contains({
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName
        });
        done()
      })
      .catch(done);
  });


});