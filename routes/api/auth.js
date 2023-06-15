const express = require('express');
const authController = require('../../controllers/auth');
const auth = require('../../middleware/auth');
const router = express.Router();

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, authController.fetchUser);

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  authController.loginUser
);

module.exports = router;
