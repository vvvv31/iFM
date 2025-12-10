// src/models/Group.js
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a group name'],
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please enter a creator ID'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      joinDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  audioList: [
    {
      audioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Audio',
      },
      addDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Group', GroupSchema);