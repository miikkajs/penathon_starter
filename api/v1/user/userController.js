const models = require('../../../models');
const PASSWORD_MIN_LENGTH = 8;
const findUsers = query =>
  models.User.findAll({where: query});

const findUser = query =>
  models.User.find({where: query});

const createUser = params => {
  try {
    const validatedParams = validateUserParams(params);
    return models.User.create(validatedParams);
  } catch (err) {
    return Promise.reject(err);
  }
};


module.exports = {
  findUser: findUser,
  findUsers: findUsers,
  createUser: createUser
};

function validateUserParams(params) {
  if (params.password && params.email) {
    params.password.length >= PASSWORD_MIN_LENGTH ?
      params.password = models.User.generateHash(params.password)
      : throwError(`Password min length is ${PASSWORD_MIN_LENGTH}`);
    return params;
  } else if (params.facebookId || params.googleId) {
    return params;
  }
  throwError('Missing password or email');
}

function throwError(message) {
  throw new Error(message);
}