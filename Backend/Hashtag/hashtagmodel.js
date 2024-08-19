const { Sequelize, DataTypes } = require('sequelize');
const { Twitter } = require('../modal'); // Import Twitter model

const db = new Sequelize('post', 'root', 'arham123', {
  host: '127.0.0.1',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

const Hashtag = db.define('Hashtag', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Twitter , 
      key: 'id',
    },
  },
});

module.exports = { Hashtag };
