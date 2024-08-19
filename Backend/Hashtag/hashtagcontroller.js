const { Hashtag } = require('./hashtagmodel'); // Import the Hashtag model
const  {Users}  = require('../auth/usermodal'); // Import the Users model
const { Sequelize, DataTypes } = require('sequelize');
const createHashtag = async (req, res) => {
  try {
    const { text } = req.body; // text is an array of hashtags
    const userId = req.user.id;

    // Validate user input
    if (!text || !userId) {
      return res.status(400).json({ message: 'Text and userId are required' });
    }

    // Check if the user exists
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Iterate over the hashtags array and create a new record for each hashtag
    const hashtags = [];
    for (const tag of text) {
      const hashtag = await Hashtag.create({
        text: tag,
        userId,
      });
      hashtags.push(hashtag);
    }

    return res.status(201).json({ message: 'Hashtags created successfully', hashtags });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while creating the hashtags', error });
  }
};

const getTrendingHashtags = async (req, res) => {
  try {
    // Attempt to fetch trending hashtags
    const trendingHashtags = await Hashtag.findAll({
      attributes: ['text', [Sequelize.fn('COUNT', Sequelize.col('text')), 'count']],
      group: ['text'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: 7, // Limit to top 10 trending hashtags
    });

    // Check if any hashtags were found
    if (trendingHashtags.length === 0) {
      return res.status(404).json({ message: 'No trending hashtags found' });
    }

    // Return the trending hashtags
    return res.status(200).json({ trendingHashtags });
  } catch (error) {
    // Enhanced error handling
    console.error('Error fetching trending hashtags:', error); // Log detailed error to server console

    // Check if error is a Sequelize-related error
    if (error instanceof Sequelize.Error) {
      return res.status(500).json({ message: 'Database error occurred', error: error.message });
    }

    // Generic error handling for unexpected issues
    return res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
  }
};
const getHashtags = async (req, res) => {
  try {
    const hashtags = await Hashtag.findAll();

    if (hashtags.length === 0) {
      return res.status(404).json({ message: 'No hashtags found' });
    }

    return res.status(200).json({ hashtags });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while fetching hashtags', error });
  }
};
module.exports = {
  createHashtag,getTrendingHashtags,getHashtags
};
