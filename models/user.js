'use strict';
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    facebookId: {
      type: DataTypes.BIGINT
    },
    googleId: {
      type: DataTypes.BIGINT
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['facebookId']
      },
      {
        unique: true,
        fields: ['googleId']
      },
      {
        unique: true,
        fields: ['email']
      }
    ],
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      },
      generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      }
    },
    instanceMethods: {
      validPassword: function (password) {
        return bcrypt.compareSync(password, this.password);
      },
      toJSON: function () {
        var privateAttributes = [ 'password' ];
        return _.omit(this.dataValues, privateAttributes);
      }
    }
  });
  return User;
};