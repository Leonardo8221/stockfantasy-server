const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../../models/User');
const Room = require('../../models/Room');

const auth = require('../../middleware/auth');

module.exports = router;
