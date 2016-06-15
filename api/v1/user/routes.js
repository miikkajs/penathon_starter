const router = require('express').Router();
const userController = require('./userController');

router.get('/user', (req, res, next) =>
  userController.findUsers(req.query)
    .then((user) => {
      return res.json(user);
    })
    .catch(next));

router.post('/user', (req, res, next) =>
  userController.createUser(req.body.username)
    .then((user) => {
      return res.json(user);
    })
    .catch(next));


module.exports = router;
