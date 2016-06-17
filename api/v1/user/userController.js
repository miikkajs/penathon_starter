const models = require('../../../models');

const findUsers = query =>
  models.User.findAll({where: query});

const findUser = query =>
  models.User.find({where: query});

const createUser = params =>
  models.User.create(params);

module.exports = {
  findUser: findUser,
  findUsers: findUsers,
  createUser: createUser
};

