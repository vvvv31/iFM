// utils/file.js - 文件处理工具

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { AUDIO, IMAGE } = require('../config/constants');

class FileUtil {
  /**
   * 生成唯一文件名
   * @param {String} originalName - 原始文件名
   */
  static generateFileName(originalName) {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(8).toString('hex');
    return `${timestamp}_${randomStr}${ext}`;
  }

  /**
   * 获取文件扩展名（不含点）
   */
  static getFileExtension(filename) {
    return path.extname(filename).substring(1).toLowerCase();
  }

  /**
   * 验证音频文件
   * @param {Object} file - Multer文件对象
   */
  static validateAudioFile(file) {
    const errors = [];

    // 检查文件大小
    if (file.size > AUDIO.MAX_SIZE) {
      errors.push(`文件大小不能超过${AUDIO.MAX_SIZE / 1024 / 1024}MB`);
    }

    // 检查文件格式
    const ext = this.getFileExtension(file.originalname);
    if (!AUDIO.ALLOWED_FORMATS.includes(ext)) {
      errors.push(`不支持的文件格式，仅支持：${AUDIO.ALLOWED_FORMATS.join(', ')}`);
    }

    // 检查MIME类型
    if (!AUDIO.MIME_TYPES.includes(file.mimetype)) {
      errors.push('文件类型不正确');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证图片文件
   */
  static validateImageFile(file) {
    const errors = [];

    if (file.size > IMAGE.MAX_SIZE) {
      errors.push(`图片大小不能超过${IMAGE.MAX_SIZE / 1024 / 1024}MB`);
    }

    const ext = this.getFileExtension(file.originalname);
    if (!IMAGE.ALLOWED_FORMATS.includes(ext)) {
      errors.push(`不支持的图片格式，仅支持：${IMAGE.ALLOWED_FORMATS.join(', ')}`);
    }

    if (!IMAGE.MIME_TYPES.includes(file.mimetype)) {
      errors.push('图片类型不正确');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 创建目录（如果不存在）
   */
  static async ensureDir(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * 删除文件
   */
  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('删除文件失败:', error);
      return false;
    }
  }

  /**
   * 获取文件URL（相对路径转换为访问URL）
   * @param {String} relativePath - 相对路径（如：uploads/audios/xxx.mp3）
   */
  static getFileUrl(relativePath) {
    if (!relativePath) return null;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 获取上传路径配置
   */
  static getUploadPath(type) {
    const basePath = path.join(process.cwd(), 'uploads');
    const paths = {
      audio: path.join(basePath, 'audios'),
      cover: path.join(basePath, 'covers'),
      avatar: path.join(basePath, 'avatars')
    };
    return paths[type] || basePath;
  }
}

module.exports = FileUtil;