const { Op } = require('sequelize');
const {Twitter} = require('./modal');
const  {Users}  = require('./auth/usermodal');

// Post a new tweet
const postTweet = async (req, res) => {
  try {
    const { postText } = req.body;
    const media = req.file ? req.file.filename : null;
    const createdAt = Date.now();
    const userId = req.user.id;

    await Twitter.create({ media, postText, isDeleted: false, createdAt, userId });
    res.status(201).json({ message: 'Tweet created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const { Sequelize } = require('sequelize');
const { Like } = require('./appriciate/appriciate'); // Ensure you're importing the necessary models

// Function to get all tweets with like count
const getTweets = async (req, res) => {
  try {
    const tweets = await Twitter.findAll({
      where: { isDeleted: false },
      attributes: [
        'id', 'postText', 'media', 'createdAt', 'userId',
        [Sequelize.fn("COUNT", Sequelize.col("likes.postId")), "likesCount"]
      ],
      include: [
        {
          model: Like,
          as: 'likes', // Use the alias 'likes' here
          attributes: []
        },
        {
          model: Users, // Include the user information
          as: 'User', // Use the alias 'User' to match the generated SQL
          attributes: ['id', 'name', 'profilePic']
        }
      ],
      group: ['Twitter.id', 'User.id'] // Use 'User.id' to match the alias in the SQL query
    });
    res.json(tweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
};


// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'profilePic', 'headerPic', 'bio'] // Added fields
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search tweets and users


const searchEverything = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Search in Twitter posts
    const tweets = await Twitter.findAll({
      where: {
        isDeleted: false,
        [Op.or]: [
          { postText: { [Op.like]: `%${q}%` } },
          { media: { [Op.like]: `%${q}%` } }
        ]
      },
      include: [
        {
          model: Users, // Include user information
          as: 'User',
          attributes: ['id', 'name', 'email', 'profilePic']
        }
      ]
    });

    // Search in Users
    const users = await Users.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
          { bio: { [Op.like]: `%${q}%` } }
        ]
      },
      attributes: ['id', 'name', 'email', 'profilePic', 'bio']
    });

    // Return both tweets and users
    res.json({ tweets, users });
  } catch (error) {
    console.error('Error searching everything:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email', 'profilePic', 'headerPic', 'bio'] // Added fields
    });

    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all posts by user ID
const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find tweets where the userId matches and isDeleted is false
    const tweets = await Twitter.findAll({
      where: {
        userId,
        isDeleted: false
      },
      order: [['createdAt', 'DESC']] // Optional: Order by creation date descending
    });

    if (!tweets.length) {
      return res.status(404).json({ message: 'No tweets found for this user' });
    }

    res.json(tweets);
  } catch (error) {
    console.error('Error getting posts by user ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, dateOfBirth, bio } = req.body;
    const updateData = {};

    if (req.files) {
      if (req.files.profilePic) {
        updateData.profilePic = req.files.profilePic[0].filename;
      }
      if (req.files.headerPic) {
        updateData.headerPic = req.files.headerPic[0].filename;
      }
    }

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (bio) updateData.bio = bio;

    const [updated] = await Users.update(updateData, {
      where: { id: userId },
    });

    if (updated) {
      res.status(200).send({ message: 'Profile updated successfully' });
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search users by name, email, or bio
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    console.log('Search query:', q); // Log the search query

    // Search in Users
    const users = await Users.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
          { bio: { [Op.like]: `%${q}%` } } // Optionally search in bio
        ]
      },
      attributes: ['id', 'name', 'email', 'profilePic', 'headerPic', 'bio'] // Added fields
    });

    // Check if there are any results
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found matching the query' });
    }

    // Send results
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  postTweet,
  getTweets,
  getUserById,
  searchEverything,
  getAllUsers,
  getPostsByUserId,
  updateUserProfile,
  searchUsers
};
