const Score = require('../models/Score');
const User = require('../models/User');

const getAllScores = async (req, res, next) => {
  try {
    const scores = await Score.find();

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    });
  }
};

const getScores = async (req, res, next) => {
  const { roomID } = req.query; // retrieve the "isStarted" value from the URL

  const scores = await Score.find({ roomID }); // use the "isStarted" value to filter the scores

  res.status(200).json(scores);
};

const createScore = async (req, res, next) => {
  const { name, type, players, roomType } = req.body;

  const creater = req.user.id;
  players.push(creater);

  let room = new Score({
    name,
    type,
    creater,
    players,
    roomType
  });

  await room.save();

  res.status(200).json(room);
};

const updateScore = async (req, res, next) => {
  try {
    const room = await Score.findByIdAndUpdate(req.params.id, req.body, {
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

const deleteScore = async (req, res, next) => {
  try {
    const room = await Score.findByIdAndDelete(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
exports.createScore = createScore;
exports.updateScore = updateScore;
exports.deleteScore = deleteScore;
exports.getAllScores = getAllScores;
exports.getScores = getScores;
