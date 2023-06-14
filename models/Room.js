const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  startedDate: {
    type: Date
  },

  createdDate: {
    type: Date,
    default: Date.now
  },
  roomType: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  }
});

module.exports = mongoose.model('Room', roomSchema);
