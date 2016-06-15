const models = require('../../../models');

const findUsers = (query) =>
  models.User.findAll({where: query});

const createUser = (username) =>
  models.User.create({username: username});

module.exports = {
  findUsers: findUsers,
  createUser: createUser
};

