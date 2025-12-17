// src/routes/upload.js - 音频上传路由

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); // 可选，用于保护路由

// 音频上传路由
router.post(
  '/audio',
  // authMiddleware, // 可选，用于保护路由
  uploadMiddleware.uploadAudio,
  uploadMiddleware.handleUploadError,
  uploadController.uploadAudio
);

// 获取音频信息路由
router.get(
  '/audio/:id',
  // authMiddleware, // 可选，用于保护路由
  uploadController.getAudioInfo
);

module.exports = router;
