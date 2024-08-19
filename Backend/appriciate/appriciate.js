const { DataTypes } = require('sequelize');
const db = require('../database');

const Like = db.define('Likes', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    primaryKey: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Twitter',
      key: 'id',
    },
    primaryKey: true,
  },
});

module.exports = {Like};
