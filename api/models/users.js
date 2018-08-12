const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true
  },
  name: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  password: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('User', userSchema);