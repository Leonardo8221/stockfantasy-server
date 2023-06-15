const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const userController = require('../../controllers/userController');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', userController.registerUser);

// @route           PUT api/users/update-password
// @description     Update password
// @access          Private
router.put('/update-password', auth, userController.updatePassword);

module.exports = router;
