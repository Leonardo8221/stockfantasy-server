const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const userController = require('../../controllers/users');

// @route    POST api/users/register
// @desc     Register user
// @access   Public
router.post('/register', userController.registerUser);

// @route           PUT api/users/update-password
// @description     Update password
// @access          Private
router.put('/update-password', auth, userController.updatePassword);

// @route       GET api/users
// @desc        Fetch users
// @access      Public
router.get('/', auth, userController.fetchAllUsers);

module.exports = router;
