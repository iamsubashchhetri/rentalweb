const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  libraryCardNumber: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
