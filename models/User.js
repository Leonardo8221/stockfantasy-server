const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  budget: {
    type: Number,
    default: 1000
  },
  score: {
    type: Number,
    default: 0
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); ///password make with hash
  }
  this.password = await bcrypt.hash(this.password, 10);
});

///compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('user', userSchema);
