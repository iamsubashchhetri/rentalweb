const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET login page
router.get('/login', (req, res) => {
  res.render('login');
});

// POST login
router.post('/login', async (req, res) => {
  const { libraryCardNumber } = req.body;
  if (libraryCardNumber === '0000' || libraryCardNumber === '1234') {
    const user = await User.findOne({ libraryCardNumber });
    if (user) {
      req.session.userId = user._id;
      return res.redirect('/profile');
    }
    
   
    return res.render('error', { message: 'User not found' });
  } else {
    return res.render('error', { message: 'Invalid library card number' });
  }
});


router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
module.exports = router;
