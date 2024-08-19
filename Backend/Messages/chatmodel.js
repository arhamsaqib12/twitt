const { DataTypes  , Sequelize} = require('sequelize');

const db = new Sequelize('post', 'root', 'arham123', {
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      timestamps: false
    }
  }); // Adjust path accordingly

const Messages = db.define('messages', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = { Messages };
