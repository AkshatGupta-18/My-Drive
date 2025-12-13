const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect('/'); // no token → redirect

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: attach user to request
    const user = await User.findById(decoded.id);
    if (!user) return res.redirect('/');

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.redirect('/');
  }
};

module.exports = auth;
