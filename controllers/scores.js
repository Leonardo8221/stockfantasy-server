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
  const { roomID } = req.query; // retrieve the "roomID" value from the URL
  const scores = await Score.find({ roomID: roomID }); // use the "roomID" value to filter the scores
  res.status(200).json(scores);
};

const giveScore = async (req, res, next) => {
  const { playerID, roomID, point } = req.body;

  // Check if a score entry with the same roomID and playerID already exists
  const existingScore = await Score.findOne({ playerID, roomID });

  if (existingScore) {
    // If an existing score is found, update the point value
    existingScore.point = point;
    await existingScore.save();

    res.status(200).json(existingScore);
  } else {
    // If no existing score is found, create a new score entry
    const score = new Score({
      playerID,
      roomID,
      point
    });

    await score.save();

    res.status(200).json(score);
  }
};

const updateScore = async (io, formData) => {
  const { roomID, players } = formData;
  try {
    const scores = await Score.find({ roomID: roomID });
    
    if (!scores.length) {
      return res.status(404).json('error');
    }

    await scores.save();
    io.emit('givedScoreToUser', socres);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.giveScore = giveScore;
exports.updateScore = updateScore;
exports.getAllScores = getAllScores;
exports.getScores = getScores;
