// routes/books.js

const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Handle book borrowing
router.post('/borrow/:id', (req, res) => {
  const bookId = req.params.id;
  const userId = req.session.userId; // Assuming user authentication middleware sets the userId in the session

  // Check if the user is logged in
  if (!userId) {
    res.status(401).send('You must be logged in to borrow books');
    return;
  }

  // Find the book by ID and update its borrowedBy field
  Book.findById(bookId, (err, book) => {
    if (err) {
      console.error('Error finding book:', err);
      res.status(500).send('Error finding book');
      return;
    }

    if (!book) {
      res.status(404).send('Book not found');
      return;
    }

    if (book.borrowedBy) {
      res.status(403).send('Book is already on loan');
      return;
    }

    book.borrowedBy = userId;
    book.save((err) => {
      if (err) {
        console.error('Error updating book:', err);
        res.status(500).send('Error updating book');
        return;
      }

      res.redirect('/');
    });
  });
});

module.exports = router;
