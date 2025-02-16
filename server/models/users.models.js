const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersModel = new Schema(
  {
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      trim: true,
      unique: true,
      required: true,
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
