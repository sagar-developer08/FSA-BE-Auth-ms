// userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
    allowNull: true,
  },
});

module.exports = User;
