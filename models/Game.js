const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },

  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  isReady: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Room', gameSchema);
