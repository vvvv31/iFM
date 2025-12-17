// src/models/Audio.js
const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter an audio title'],
  },
  description: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    required: [true, 'Please enter a file name'],
  },
  originalName: {
    type: String,
    required: [true, 'Please enter an original file name'],
  },
  filePath: {
    type: String,
    required: [true, 'Please enter a file path'],
  },
  fileUrl: {
    type: String,
    required: [true, 'Please enter a file URL'],
  },
  size: {
    type: Number,
    required: [true, 'Please enter a file size'],
  },
  mimeType: {
    type: String,
    required: [true, 'Please enter a MIME type'],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please enter a user ID'],
  },
});

module.exports = mongoose.model('Audio', AudioSchema);