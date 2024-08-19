const express = require('express');
const { 
  postTweet, 
  getTweets, 
  searchEverything, 
  getAllUsers, 
  getPostsByUserId, 
  getUserById, 
  updateUserProfile, 
  searchUsers
} = require('./controller');
const upload = require('./multer'); // Import Multer

const router = express.Router();

// Route to search tweets and users
router.get('/search', searchEverything);

// Route to get all tweets
router.get('/', getTweets);

// Route to get all users
router.get('/user', getAllUsers);

// Route to get a specific user by ID
router.get('/user/:id', getUserById);
router.get('/searchuser', searchUsers);
// Route to post a new tweet with media
router.post('/', upload.single('media'), postTweet);

// Route to get all posts by a specific user ID
router.get('/:id', getPostsByUserId);

// Route to update user profile with profilePic and headerPic
router.put('/user/edit/:id', upload.fields([
  { name: 'profilePic', maxCount: 1 }, 
  { name: 'headerPic', maxCount: 1 }
]), updateUserProfile);

// router.js

const { likeTweet, unlikeTweet } = require('./appriciate/controller.js');






// Route to like a tweet
router.post('/like', likeTweet);
router.post
// Route to unlike a tweet
router.delete('/like', unlikeTweet);










module.exports = router;
