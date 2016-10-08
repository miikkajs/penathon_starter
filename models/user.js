'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
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
        fields: ['facebookId', 'googleId']
      }
    ],
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};