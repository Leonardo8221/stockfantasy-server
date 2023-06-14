const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

      user = new User({
        name,
        email,
        avatar,
        password
      });

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_KEY,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route           PUT api/users/update-password/:id
// @description     Update password
// @access          Public
router.put(
  '/update-password',
  auth,
  check('oldPassword', 'Please enter a current password').notEmpty(),
  check(
    'newPassword',
    'Please enter a new password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('error: ' + errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { oldPassword, newPassword } = req.body;

    try {
      let user = await User.findById(req.user.id);

      if (user) {
        const isPasswordMatched = await user.comparePassword(oldPassword);

        if (!isPasswordMatched) {
          res
            .status(400)
            .json({ errors: [{ message: 'Old password is incorrect' }] });
          // return next(new ErrorHandler("Old password is incorrect", 400));
        } else {
          user.password = newPassword;

          console.log('User', user);
          await user.save();

          const payload = {
            user: {
              id: user.id
            }
          };
          console.log('Password Updated');
          res.status(200).json({
            success: [
              { msg: 'Password Updated successfully', payload: payload }
            ]
          });
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ errors: err.errors });
    }
  }
);

module.exports = router;
