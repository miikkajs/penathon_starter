const userController = require('../api/v1/user/userController');

const passport = require('passport');

const isAuthenticated = (req, res, next) =>
  req.user ? next() : res.status(403).send();

module.exports = {
  isAuthenticated: isAuthenticated
};

