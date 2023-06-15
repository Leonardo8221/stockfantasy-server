const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const auth = require('../../middleware/auth');

const roomController = require('../../controlles/rooms');

// @route           POST api/rooms
// @description     Create Game Room
// @access          Public
router.post('/', auth, roomController.createRoom);


module.exports = router;
