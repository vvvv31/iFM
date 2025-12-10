// src/controllers/groupController.js - 合集控制器

const { Group, Audio } = require('../models');
const Response = require('../utils/response');

const groupController = {
  /**
   * 创建新合集
   */
  async createGroup(req, res, next) {
    try {
      const { name, description } = req.body;
      const creatorId = req.user?.id;

      // 验证用户ID
      if (!creatorId) {
        return Response.unauthorized(res, '未授权的访问');
      }

      // 验证输入
      if (!name || name.trim() === '') {
        return Response.badRequest(res, '合集名称不能为空');
      }

      // 创建新合集
      const newGroup = await Group.create({
        name: name.trim(),
        description: description?.trim() || '',
        creatorId,
        members: [{ userId: creatorId }],
      });

      return Response.success(res, newGroup, '合集创建成功');
    } catch (error) {
      // 处理特定错误
      if (error.name === 'ValidationError') {
        return Response.badRequest(res, '数据验证失败: ' + Object.values(error.errors).map(err => err.message).join(', '));
      }
      next(error);
    }
  },

  /**
   * 获取用户的所有合集
   */
  async getGroupsByUser(req, res, next) {
    try {
      const userId = req.user.id;

      // 查找用户参与的所有合集
      const groups = await Group.find({
        'members.userId': userId,
      });

      return Response.success(res, groups, '获取合集列表成功');
    } catch (error) {
      next(error);
    }
  },

  /**
   * 获取单个合集的详细信息
   */
  async getGroupById(req, res, next) {
    try {
      const { id } = req.params;

      // 查找合集
      const group = await Group.findById(id).populate('audioList.audioId');

      if (!group) {
        return Response.notFound(res, '合集不存在');
      }

      return Response.success(res, group, '获取合集详情成功');
    } catch (error) {
      next(error);
    }
  },

  /**
   * 将音频添加到合集中
   */
  async addAudioToGroup(req, res, next) {
    try {
      const { groupId, audioId } = req.body;

      // 查找合集
      const group = await Group.findById(groupId);
      if (!group) {
        return Response.notFound(res, '合集不存在');
      }

      // 查找音频
      const audio = await Audio.findById(audioId);
      if (!audio) {
        return Response.notFound(res, '音频不存在');
      }

      // 更新音频的groupId
      audio.groupId = groupId;
      await audio.save();

      // 将音频添加到合集的audioList中
      group.audioList.push({
        audioId: audio._id,
      });
      await group.save();

      return Response.success(res, null, '音频添加到合集成功');
    } catch (error) {
      next(error);
    }
  },

  /**
   * 从合集中移除音频
   */
  async removeAudioFromGroup(req, res, next) {
    try {
      const { groupId, audioId } = req.body;

      // 查找合集
      const group = await Group.findById(groupId);
      if (!group) {
        return Response.notFound(res, '合集不存在');
      }

      // 查找音频
      const audio = await Audio.findById(audioId);
      if (!audio) {
        return Response.notFound(res, '音频不存在');
      }

      // 更新音频的groupId
      audio.groupId = null;
      await audio.save();

      // 从合集的audioList中移除音频
      group.audioList = group.audioList.filter(item => !item.audioId.equals(audio._id));
      await group.save();

      return Response.success(res, null, '音频从合集移除成功');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = groupController;