const mongoose = require('mongoose');
const classSchema = require('../schemas/classSchema');

// Create the Class model
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
