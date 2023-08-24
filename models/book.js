// models/book.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String,
  available: Boolean,
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

bookSchema.methods.borrowBook = async function (libraryCardNumber) {
  this.borrowedBy = libraryCardNumber;
  await this.save();
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
