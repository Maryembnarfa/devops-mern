const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersModel = new Schema(
  {
    name: {
      type: 'string',
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true,
    },
    role: {
      type: 'string',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('users', UsersModel);
