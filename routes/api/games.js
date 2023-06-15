const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const auth = require('../../middleware/auth');

const gameController = require('../../controllers/games');

// @route           POST api/games
// @description     Create Game
// @access          Private
router.post('/', auth, gameController.createGame);

// @route           PUT api/games/:id
// @description     Update Game
// @access          Private
router.put('/updateGame/:id', auth, gameController.updateGame);

// @route           GET api/games/:id
// @description     Get Game By Id
// @access          Private
router.get('/getGame/:id', auth, gameController.getGame);

// @route           DELETE api/games/:id
// @description     Delete Game by Id
// @access          Private
router.delete('/deleteGame/:id', auth, gameController.deleteGame);

// @route           GET api/games
// @description     Get ALL Games
// @access          Private
router.get('/getAllGames/', auth, gameController.getAllGames);

// @route           GET api/games/stocks
// @description     Get all Stocks
// @access          Private
router.get('/stocks', auth, gameController.getAllStocks);

module.exports = router;
