// utils/cache.js - Redis缓存管理工具

const redis = require('redis');
const { REDIS_KEYS } = require('../config/constants');

class CacheUtil {
  constructor() {
    this.client = null;
  }

  /**
   * 初始化Redis连接
   */
  async connect() {
    try {
      this.client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0
      });

      this.client.on('error', (err) => {
        console.error('Redis连接错误:', err);
      });

      this.client.on('connect', () => {
        console.log('Redis连接成功');
      });

      await this.client.connect();
    } catch (error) {
      console.error('Redis初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置缓存
   * @param {String} key - 键
   * @param {*} value - 值
   * @param {Number} expireSeconds - 过期时间（秒），默认24小时
   */
  async set(key, value, expireSeconds = 86400) {
    try {
      const stringValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : String(value);
      
      await this.client.setEx(key, expireSeconds, stringValue);
      return true;
    } catch (error) {
      console.error('设置缓存失败:', error);
      return false;
    }
  }

  /**
   * 获取缓存
   * @param {String} key - 键
   * @param {Boolean} parseJson - 是否解析JSON
   */
  async get(key, parseJson = true) {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      
      if (parseJson) {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    } catch (error) {
      console.error('获取缓存失败:', error);
      return null;
    }
  }

  /**
   * 删除缓存
   */
  async delete(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('删除缓存失败:', error);
      return false;
    }
  }

  /**
   * 批量删除（通过模式匹配）
   */
  async deletePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('批量删除缓存失败:', error);
      return false;
    }
  }

  /**
   * 检查键是否存在
   */
  async exists(key) {
    try {
      return await this.client.exists(key) === 1;
    } catch (error) {
      console.error('检查缓存存在性失败:', error);
      return false;
    }
  }

  /**
   * 设置用户Token缓存
   */
  async setUserToken(userId, token, expireSeconds = 604800) { // 7天
    const key = `${REDIS_KEYS.USER_TOKEN}${userId}`;
    return await this.set(key, token, expireSeconds);
  }

  /**
   * 获取用户Token
   */
  async getUserToken(userId) {
    const key = `${REDIS_KEYS.USER_TOKEN}${userId}`;
    return await this.get(key, false);
  }

  /**
   * 删除用户Token（登出）
   */
  async deleteUserToken(userId) {
    const key = `${REDIS_KEYS.USER_TOKEN}${userId}`;
    return await this.delete(key);
  }

  /**
   * 缓存用户信息
   */
  async setUserInfo(userId, userInfo, expireSeconds = 3600) { // 1小时
    const key = `${REDIS_KEYS.USER_INFO}${userId}`;
    return await this.set(key, userInfo, expireSeconds);
  }

  /**
   * 获取用户信息缓存
   */
  async getUserInfo(userId) {
    const key = `${REDIS_KEYS.USER_INFO}${userId}`;
    return await this.get(key);
  }

  /**
   * 缓存热门节目列表
   */
  async setHotEpisodes(episodes, expireSeconds = 3600) {
    return await this.set(REDIS_KEYS.HOT_EPISODES, episodes, expireSeconds);
  }

  /**
   * 获取热门节目缓存
   */
  async getHotEpisodes() {
    return await this.get(REDIS_KEYS.HOT_EPISODES);
  }

  /**
   * 关闭连接
   */
  async disconnect() {
    if (this.client) {
      await this.client.quit();
    }
  }
}

// 导出单例
module.exports = new CacheUtil();