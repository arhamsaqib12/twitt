const express = require('express');
const { Messages, Users } = require('../auth/authrouter');
const { Op } = require('sequelize');
const chatrouter = express.Router();

// Send a message
chatrouter.post('/send', async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const sender = await Users.findByPk(senderId);
    const receiver = await Users.findByPk(receiverId);
    
    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User(s) not found' });
    }

    const message = await Messages.create({ senderId, receiverId, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});

// Get messages between two users
chatrouter.get('/history/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Messages.findAll({
      where: {
        [Op.or]: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 }
        ]
      },
      order: [['timestamp', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

module.exports = chatrouter;
