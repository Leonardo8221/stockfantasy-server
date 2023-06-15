const Room = require('../models/Room');
const User = require('../models/User');

const createRoom = async (req, res, next) => {
  const { name, type } = req.body;

  const creater = req.user.id;

  let room = new Room({
    name,
    type,
    creater,
  });

  await room.save();

  const payload = {
    success: true,
    room
  };

  res.status(200).json(payload);

};

exports.createRoom = createRoom;
