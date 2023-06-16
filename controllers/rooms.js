const Room = require('../models/Room');
const User = require('../models/User');

const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();

    res.status(200).json({
      rooms,
      numOfRooms: rooms.length
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      error
    });
  }
};

const getRoom = async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  res.status(200).json(room);
};

const createRoom = async (req, res, next) => {
  const { name, type, players, roomType } = req.body;

  const creater = req.user.id;

  let room = new Room({
    name,
    type,
    creater,
    players,
    roomType,
  });

  await room.save();

  res.status(200).json(room);
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
    res.status(200).json(room);
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
