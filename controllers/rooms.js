const Room = require('../models/Room');
const User = require('../models/User');

const getAllRooms = async (req, res, next) => {
  const rooms = await Room.findAll();

  res.status(200).json({
    success: true,
    rooms,
    numOfRooms: rooms.length
  });
};

const getRoom = async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  res.status(200).json({
    success: true,
    room
  });
};

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

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
exports.createRoom = createRoom;
exports.updateRoom = updateRoom;
exports.deleteRoom = deleteRoom;
exports.getRoom = getRoom;
exports.getAllRooms = getAllRooms;
