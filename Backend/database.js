// database.js
const { Sequelize } = require('sequelize');

const db = new Sequelize('post', 'root', 'arham123', {
  host: '127.0.0.1',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

module.exports = db;
