const fmp = require('financialmodelingprep')(
  'f10a1d8a11d2cc5b706ea21564646b12'
);

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

const getGames = async (req, res, next) => {
  const { roomID } = req.query; // retrieve the "isStarted" value from the URL
  const rooms = await Game.find({ roomID: roomID }); // use the "isStarted" value to filter the rooms

  res.status(200).json(rooms);
};

const createGame = async (req, res, next) => {
  const { roomID, selectedStocks } = req.body;

  const playerID = req.user.id;

  let game = new Game({
    playerID,
    roomID,
    isReady: true,
    stocks: selectedStocks
  });

  await game.save();

  return res.status(200).json(game);
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
  // API route: /quote/AAPL
  fmp.market.index
    .list()
    .then((response) => res.json(response));
};

exports.createGame = createGame;
exports.updateGame = updateGame;
exports.deleteGame = deleteGame;
exports.getGame = getGame;
exports.getGames = getGames;
exports.getAllGames = getAllGames;
exports.getAllStocks = getAllStocks;
