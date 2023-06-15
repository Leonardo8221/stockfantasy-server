const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
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
  isReady: {
    type: Boolean,
    default: false
  },
  stocks: [
    {
      type: Object
    }
  ]
});

module.exports = mongoose.model('Game', gameSchema);
