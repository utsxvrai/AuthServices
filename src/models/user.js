'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

const { SALT } = require('../config/server-config');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define association with Role model
      this.belongsToMany(models.Role, {
        through: 'User_Roles',
      });
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 100],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      indexes: [
        {
          unique: true,
          fields: ['email'],
          name: 'unique_user_email', // Specify a unique name for the index
        },
      ],
    }
  );

  // Encrypt password before saving
  User.beforeCreate((user) => {
    const encryptedPassword = bcrypt.hashSync(user.password, SALT);
    user.password = encryptedPassword;
  });

  return User;
};


