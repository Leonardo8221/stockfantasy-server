const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const auth = require('../../middleware/auth');

const roomController = require('../../controllers/rooms');

// @route           POST api/rooms
// @description     Create Room
// @access          Private
router.post('/', auth, roomController.createRoom);

// @route           PUT api/rooms/:id
// @description     Update Room
// @access          Private
router.put('/:id', auth, roomController.updateRoom);

// @route           GET api/rooms/:id
// @description     Get Room By Id
// @access          Private
router.get('/:id', auth, roomController.getRoom);

// @route           DELETE api/rooms/:id
// @description     Delete Room by Id
// @access          Private
router.delete('/:id', auth, roomController.deleteRoom);

// @route           GET api/rooms
// @description     Get ALL Rooms
// @access          Private
router.get('/', auth, roomController.getAllRooms);

module.exports = router;
