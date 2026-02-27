const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// @route    GET api/posts
// @desc     Get all posts
// @access   Public
router.get('/', (req, res) => {
    res.send('Get all posts route');
});

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post('/', auth, (req, res) => {
    res.send('Create post route (protected)');
});

module.exports = router;
