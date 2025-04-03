const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Question', questionSchema); 