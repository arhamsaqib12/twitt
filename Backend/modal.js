const { DataTypes } = require('sequelize');
const db = require('./database');

const Twitter = db.define('Twitter', {
  media: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = {Twitter};
