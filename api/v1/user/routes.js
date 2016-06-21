const router = require('express').Router();
const userController = require('./userController');
const passportConfig = require('../../../config/passport');

router.get('/user', passportConfig.isAuthenticated, (req, res, next) =>
  userController.findUser({id: req.user.id})
    .then((user) => {
      return res.json(user);
    })
    .catch(next));

router.post('/user', passportConfig.isAuthenticated, (req, res, next) =>
  userController.createUser(req.body.username)
    .then((user) => {
      return res.json(user);
    })
    .catch(next));


module.exports = router;
