const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET profile page
router.get('/profile', async (req, res) => {
  const user = req.session.user;
  const books = await Book.find({ borrowedBy: user.libraryCardNumber });
  res.render('profile', { user, books });
});

module.exports = router;
