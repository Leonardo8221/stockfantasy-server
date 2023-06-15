const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../models/User');

const fetchAllUsers = async (req, res, next) => {
  const users = await User.find({_id: {$ne: req.user.id}});

  console.log(users);

  res.status(200).json({
    success: true,
    users,
    numOfUsers: users.length
  });
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
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
};

const updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
        await user.save();

        const payload = {
          user
        };
        res.status(200).json({
          success: [{ msg: 'Password Updated successfully', payload: payload }]
        });
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ errors: err.errors });
  }
};

exports.fetchAllUsers = fetchAllUsers;
exports.registerUser = registerUser;
exports.updatePassword = updatePassword;
