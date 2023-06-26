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
  const scores = await Score.find({ roomID: roomID }); // use the "isStarted" value to filter the scores
  res.status(200).json(scores);
};

const createScore = async (req, res, next) => {
  const { playerID, roomID, score } = req.body;

  let score = new Score({
    
    playerID,
    roomID,
    score
  });

  await score.save();

  res.status(200).json(score);
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
