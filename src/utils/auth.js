// utils/auth.js - JWT认证工具

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT } = require('../config/constants');

class AuthUtil {
  /**
   * 生成JWT Token
   * @param {Object} payload - 载荷数据（userId, role等）
   * @param {String} expiresIn - 过期时间
   */
  static generateToken(payload, expiresIn = JWT.ACCESS_TOKEN_EXPIRES) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  /**
   * 验证JWT Token
   * @param {String} token - JWT token
   * @returns {Object|null} 解码后的payload或null
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  /**
   * 从请求头中提取Token
   * @param {Object} req - Express请求对象
   * @returns {String|null} Token或null
   */
  static extractToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * 密码加密
   * @param {String} password - 明文密码
   * @returns {Promise<String>} 加密后的密码
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * 密码验证
   * @param {String} password - 明文密码
   * @param {String} hashedPassword - 加密后的密码
   * @returns {Promise<Boolean>} 是否匹配
   */
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * 生成Access Token和Refresh Token
   * @param {Object} user - 用户信息
   */
  static generateTokenPair(user) {
    const payload = {
      userId: user.user_id,
      username: user.username,
      role: user.role
    };

    return {
      accessToken: this.generateToken(payload, JWT.ACCESS_TOKEN_EXPIRES),
      refreshToken: this.generateToken(payload, JWT.REFRESH_TOKEN_EXPIRES)
    };
  }

  /**
   * 检查用户权限
   * @param {String} userRole - 用户角色
   * @param {Array} allowedRoles - 允许的角色列表
   */
  static hasPermission(userRole, allowedRoles) {
    return allowedRoles.includes(userRole);
  }
}

module.exports = AuthUtil;