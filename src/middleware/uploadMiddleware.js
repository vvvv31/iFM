// middleware/uploadMiddleware.js - 文件上传中间件

const multer = require('multer');
const path = require('path');
const FileUtil = require('../utils/file');
const Response = require('../utils/response');

/**
 * 配置音频上传
 */
const audioStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = FileUtil.getUploadPath('audio');
    await FileUtil.ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = FileUtil.generateFileName(file.originalname);
    cb(null, uniqueName);
  }
});

/**
 * 配置图片上传
 */
const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = FileUtil.getUploadPath('cover');
    await FileUtil.ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = FileUtil.generateFileName(file.originalname);
    cb(null, uniqueName);
  }
});

/**
 * 音频上传中间件
 */
exports.uploadAudio = multer({
  storage: audioStorage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: (req, file, cb) => {
    const validation = FileUtil.validateAudioFile(file);
    if (!validation.valid) {
      return cb(new Error(validation.errors.join('; ')), false);
    }
    cb(null, true);
  }
}).single('audio');

/**
 * 图片上传中间件
 */
exports.uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const validation = FileUtil.validateImageFile(file);
    if (!validation.valid) {
      return cb(new Error(validation.errors.join('; ')), false);
    }
    cb(null, true);
  }
}).single('image');

/**
 * 文件上传错误处理
 */
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return Response.badRequest(res, '文件大小超出限制');
    }
    return Response.badRequest(res, `文件上传失败: ${err.message}`);
  }
  
  if (err) {
    return Response.badRequest(res, err.message);
  }
  
  next();
};