const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  creater: {
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
  
  endDate: {
    type: Date
  },

  createdDate: {
    type: Date,
    default: Date.now
  },
  roomType: {
    type: String,
    enum: ['random', 'private'],
    default: 'random'
  }
});

module.exports = mongoose.model('Room', roomSchema);
