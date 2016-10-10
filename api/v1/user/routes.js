const router = require('express').Router();
const userController = require('./userController');
const passportConfig = require('../../../config/passport');
const Promise = require('bluebird');

router.get('/user', passportConfig.isAuthenticated, Promise.coroutine(function*(req, res, next) {
  try {
    const user = yield userController.findUser({id: req.user.id});
    return res.json(user.toJSON());
  } catch (err) {
    next(err);
  }
}));

router.post('/user', Promise.coroutine(function*(req, res, next) {
  try {
    const user = yield userController.createUser(req.body);
    return res.json(user.toJSON());
  } catch (err) {
    next(err);
  }
}));

router.get('/users', passportConfig.isAuthenticated, Promise.coroutine(function*(req, res, next) {
  try {
    const users = yield userController.findUsers({});
    return res.json(users.map(user => user.toJSON()))
  } catch (err) {
    next(err);
  }
}));


module.exports = router;
