const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const auth = require('../../middleware/auth');

const scoreController = require('../../controllers/scores');

// @route           POST api/scores
// @description     Create Score
// @access          Private
router.post('/', auth, scoreController.createScore);

// @route           PUT api/scores/:id
// @description     Update Score
// @access          Private
router.put('/:id', auth, scoreController.updateScore);


// @route           GET api/scores
// @description     Get Score By Id
// @access          Private
router.get('/', auth, scoreController.getScores);

// @route           GET api/scores
// @description     Get ALL Rooms
// @access          Private
router.get('/all', auth, scoreController.getAllScores);

module.exports = router;
