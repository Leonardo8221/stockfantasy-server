const mongoose = require('mongoose');
const scoreSchema = new mongoose.Schema({
  playerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Score', scoreSchema);
