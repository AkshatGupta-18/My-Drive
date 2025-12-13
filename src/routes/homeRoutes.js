const express = require('express');
const router = express.Router();
const File = require('../models/File'); // your Mongoose model for files
const auth = require('../middleware/auth'); // your JWT auth middleware

// Show home page with user's files
router.get('/', auth, async (req, res) => {
  try {
    // Fetch files uploaded by this user
    const files = await File.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.render('home', { user: req.user, files }); // pass user and files to EJS
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
