const mongoose = require('mongoose');
const userSchema = require('../schemas/userSchema');

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
