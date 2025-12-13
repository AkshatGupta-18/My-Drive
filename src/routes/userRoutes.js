const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/jwt');
const bcrypt = require('bcryptjs');

// Show register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle form submission
// Handle form submission
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in DB
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Store token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Redirect to /home after successful registration
    res.redirect('/home');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});


// Show login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {

    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    password = password.trim();

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid email or password');

        const token = generateToken(user);

        // Store token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        // Redirect to home page after successful login
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Handle logout
router.get('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');

  // Redirect to landing page
  res.redirect('/');
});


module.exports = router;
