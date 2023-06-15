const Room = require('../models/Room');
const User = require('../models/User');

const createRoom = async (req, res, next) => {
  const { name, type, players} = req.body;

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

exports.createRoom = createRoom;
