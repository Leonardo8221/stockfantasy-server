const Room = require('../models/Room');
const User = require('../models/User');

const createRoom = async (req, res, next) => {
  const { name, type, players } = req.body;

  const creater = req.user.id;

  let room = new Room({
    name,
    type,
    creater,
    players
  });

  await room.save();

  return res.status(200).json({
    success: true,
    room
  });
};

const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!room) {
      return res.status(404).json('error');
    }
    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.createRoom = createRoom;
exports.updateRoom = updateRoom;
