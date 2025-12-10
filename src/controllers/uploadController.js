// src/controllers/uploadController.js - 音频上传控制器

const FileUtil = require('../utils/file');
const Response = require('../utils/response');
const { Audio, Group } = require('../models');

const uploadController = {
  /**
   * 处理音频文件上传
   */
  async uploadAudio(req, res, next) {
    try {
      // 检查是否有文件上传
      if (!req.file) {
        return Response.badRequest(res, '未检测到音频文件');
      }
      
      // 获取上传的文件信息
      const file = req.file;
      const { title, description, groupId } = req.body;
      const userId = req.user.userId;
      
      // 生成文件访问URL
      const normalizedPath = file.path;
      const fileUrl = FileUtil.getFileUrl(normalizedPath);
      
      // 构建音频数据
      const audioData = {
        title: title || file.originalname,
        description: description || '',
        fileName: file.filename,
        originalName: file.originalname,
        filePath: normalizedPath,
        fileUrl: fileUrl,
        size: file.size,
        mimeType: file.mimetype,
        userId,
      };

      // 如果指定了合集ID，验证合集是否存在
      if (groupId) {
        const group = await Group.findById(groupId);
        if (!group) {
          return Response.notFound(res, '指定的合集不存在');
        }
        audioData.groupId = groupId;
      }
      
      // 保存音频信息到数据库
      const newAudio = await Audio.create(audioData);

      // 如果指定了合集ID，将音频添加到合集中
      if (groupId) {
        await Group.findByIdAndUpdate(groupId, {
          $push: {
            audioList: {
              audioId: newAudio._id,
              addDate: new Date(),
            },
          },
        });
      }
      
      // 返回上传成功响应
      return Response.success(res, newAudio, '音频上传成功');
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * 获取音频文件信息
   */
  async getAudioInfo(req, res, next) {
    try {
      const { id } = req.params;
      
      // 在实际应用中，这里应该从数据库获取音频信息
      // const audio = await AudioModel.findById(id);
      
      // 模拟音频信息
      const audioInfo = {
        id,
        title: '示例音频',
        description: '这是一个示例音频文件',
        fileName: '1234567890_abcdef.mp3',
        originalName: 'example.mp3',
        filePath: 'uploads/audios/1234567890_abcdef.mp3',
        fileUrl: 'http://localhost:3000/uploads/audios/1234567890_abcdef.mp3',
        size: 1024 * 1024, // 1MB
        mimeType: 'audio/mpeg',
        uploadDate: new Date(),
      };
      
      return Response.success(res, audioInfo, '获取音频信息成功');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = uploadController;
