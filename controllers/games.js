const https = require('https');

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
const createGameBySocket = async (io, G) => {
  const { roomID, selectedStocks, playerID } = G;

  let game = new Game({
    playerID,
    roomID,
    isReady: true,
    stocks: selectedStocks
  });

  await game.save();
  io.emit('GameReady', game);
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
  const options = {
    hostname: 'financialmodelingprep.com',
    port: 443,
    path: 'https://financialmodelingprep.com/api/v3/stock/list?apikey=16eec80c5f5ee710a5a15f0e381f88a6',
    method: 'GET'
  }

  const request = https.request(options, (response) => {
    response.on('data', (data) => {
      res.status(201).send(data)
    })
  })

  request.on('error', (error) => {
    console.error(error)
    res.status(500).send('Internal Server Error')
  })

  request.end()
};

exports.createGame = createGame;
exports.updateGame = updateGame;
exports.deleteGame = deleteGame;
exports.getGame = getGame;
exports.getGames = getGames;
exports.getAllGames = getAllGames;
exports.getAllStocks = getAllStocks;

exports.createGameBySocket = createGameBySocket;
