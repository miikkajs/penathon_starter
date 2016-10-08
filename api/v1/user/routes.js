const router = require('express').Router();
const userController = require('./userController');
const passportConfig = require('../../../config/passport');
const Promise = require('bluebird');

router.get('/user', passportConfig.isAuthenticated, Promise.coroutine(function* (req, res, next){
  const user = yield userController.findUser({id: req.user.id});
  return res.json(user);
}));

router.post('/user', passportConfig.isAuthenticated, Promise.coroutine(function* (req, res, next) {
  const user = yield userController.createUser(req.body.username);
  return res.json(user);
}));

router.get('/users', passportConfig.isAuthenticated, Promise.coroutine(function* (req, res, next) {
  const users = yield userController.findUsers({});
  return res.json(users)
}));


module.exports = router;
