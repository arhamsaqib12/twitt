// controller.js
const  {Twitter}  = require('../modal');
const  {Like} = require('./appriciate');



// Function to handle likes
const likeTweet = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    await Like.create({ userId, postId });
    res.status(200).json({ message: 'Tweet liked' });
  } catch (error) {
    console.error('Error liking tweet:', error);
    res.status(500).json({ error: 'Failed to like tweet' });
  }
};

// Function to get the number of likes by userId
const getLikesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const likeCount = await Like.count({ where: { userId } });

    res.status(200).json({ userId, likeCount });
  } catch (error) {
    console.error('Error retrieving likes for user:', error);
    res.status(500).json({ error: 'Failed to retrieve likes' });
  }
};



// Function to handle unlikes
const unlikeTweet = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    await Like.destroy({ where: { userId, postId } });
    res.status(200).json({ message: 'Tweet unliked' });
  } catch (error) {
    console.error('Error unliking tweet:', error);
    res.status(500).json({ error: 'Failed to unlike tweet' });
  }
};

module.exports = {

  likeTweet,
  unlikeTweet,
  getLikesByUserId
};
