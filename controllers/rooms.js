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

const getRooms = async (req, res, next) => {
  const { isStarted } = req.query; // retrieve the "isStarted" value from the URL
  const query =
    isStarted === 'true'
      ? { startedDate: { $ne: null } }
      : { startedDate: null };
  const rooms = await Room.find(query); // use the "isStarted" value to filter the rooms

  res.status(200).json(rooms);
};

const createRoom = async (req, res, next) => {
  const { name, type, players, roomType } = req.body;

  const creater = req.user.id;
  players.push(creater);

  let room = new Room({
    name,
    type,
    creater,
    players,
    roomType
  });

  await room.save();

  res.status(200).json(room);
};
const createRoomBySocket = async (io, R) => {
  const { name, type, players, roomType, creater } = R;

  // const creater = req.user.id;
  players.push(creater);

  let room = new Room({
    name,
    type,
    creater,
    players,
    roomType
  });

  await room.save();
  io.emit('RoomAdded', room);
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

const joinGame = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room.players.indexOf(req.body.userID) !== -1) {
      // If the new item already exists in the array, replace it
      room.players[room.players.indexOf(req.body.userID)] = req.body.userID;
    } else {
      // If the new item doesn't exist in the array, add it to the end
      room.players.push(req.body.userID);
    }
    // room.players.push(req.body.userID);
    room.save();
    if (!room) {
      return res.status(404).json('error');
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const joinGameBySocket = async (io, R) => {
  const { userID, roomID } = R;
  try {
    const room = await Room.findById(roomID);
    if (room.players.indexOf(userID) !== -1) {
      // If the new item already exists in the array, replace it
      room.players[room.players.indexOf(userID)] = userID;
    } else {
      // If the new item doesn't exist in the array, add it to the end
      room.players.push(userID);
    }

    room.save();
    if (!room) {
      console.log('Error');
    }
    io.emit('UserJoined', room);
  } catch (error) {
    console.log('Error: ', error);
  }
};

const exitGame = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room.roomType !== 'private' && req.user.id != room.creater) {
      // Find the index of the element to remove
      let index = room.players.indexOf(req.user.id);

      // Remove the element from the array
      if (index > -1) {
        room.players.splice(index, 1);
      }
      room.save();
    }
    if (!room) {
      return res.status(404).json('error');
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ error });
  }
};
const exitGameBySocket = async (io, R) => {
  const { userID, roomID } = R;
  try {
    const room = await Room.findById(roomID);

    if (room.roomType !== 'private' && userID != room.creater) {
      // Find the index of the element to remove
      let index = room.players.indexOf(userID);

      // Remove the element from the array
      if (index > -1) {
        room.players.splice(index, 1);
      }
      room.save();
    }
    if (!room) {
      return console.log('Error', error);
    }
    io.emit('UserExited', room);
  } catch (error) {
    console.log('Error', error);
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
exports.getRooms = getRooms;
exports.joinGame = joinGame;
exports.exitGame = exitGame;

exports.createRoomBySocket = createRoomBySocket;
exports.joinGameBySocket = joinGameBySocket;
exports.exitGameBySocket = exitGameBySocket;
