const express = require('express');
const router = express.Router();
const { createHashtag, getHashtags, getTrendingHashtags } = require('./hashtagcontroller');

// Route to create hashtags
router.post('/', createHashtag);

// Route to get all hashtags
router.get('/', getHashtags);

// Route to get trending hashtags
router.get('/trending', getTrendingHashtags);

module.exports = router;
