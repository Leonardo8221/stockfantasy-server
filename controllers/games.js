const fetch = require('node-fetch');

const Game = require('../models/Game');
const User = require('../models/User');
const Room = require('../models/Room');

const getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find();

    res.status(200).json({
      success: true,
      games,
      numOfGames: games.length
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      error
    });
  }
};

const getGame = async (req, res, next) => {
  const game = await Game.findById(req.params.id);

  res.status(200).json({
    success: true,
    game
  });
};

const createGame = async (req, res, next) => {
  const { roomID, isReady, stocks } = req.body;

  const playerID = req.user.id;

  let game = new Game({
    playerID,
    roomID,
    isReady,
    stocks
  });

  await game.save();

  /**
   * Update the room with new player
   */
  // Find the room you want to update
  let room = await Room.findById(roomID);
  if (room) {
    // Add the new player to the players array
    room.players.push(playerID);

    // Save the updated room
    room.save((err, updatedRoom) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(
        `Room ${updatedRoom.name} updated with new player ${playerID}`
      );
    });
  }

  return res.status(200).json({
    success: true,
    game
  });
};

const updateGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!game) {
      return res.status(404).json('error');
    }
    res.status(200).json({ success: true, game });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, game });
  } catch (err) {
    next(err);
  }
};

const getAllStocks = async (req, res, next) => {
  const apiKey = '16eec80c5f5ee710a5a15f0e381f88a6';
  url = ' http://finviz.com/export.ashx?v=152&f=idx_sp500&ft=1&ta=1&p=d&r=1&c=1'

  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
};

exports.createGame = createGame;
exports.updateGame = updateGame;
exports.deleteGame = deleteGame;
exports.getGame = getGame;
exports.getAllGames = getAllGames;
exports.getAllStocks = getAllStocks;
