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
      name: {
        // New field for storing user's name
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50], // Ensure name is between 1 and 50 characters
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true, // Validate email format
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 100], // Ensure password is between 3 and 100 characters
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
          name: 'unique_user_email', // Unique index for the email field
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
