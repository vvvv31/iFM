// middleware/authMiddleware.js - 认证中间件

const AuthUtil = require('../utils/auth');
const Response = require('../utils/response');
const { USER_ROLES } = require('../config/constants');

/**
 * 验证Token中间件
 */
exports.authenticate = async (req, res, next) => {
  try {
    const token = AuthUtil.extractToken(req);
    
    if (!token) {
      return Response.unauthorized(res, '请先登录');
    }

    const decoded = AuthUtil.verifyToken(token);
    
    if (!decoded) {
      return Response.unauthorized(res, 'Token无效或已过期');
    }

    // 将用户信息挂载到req对象
    req.user = decoded;
    next();
  } catch (error) {
    return Response.unauthorized(res, '认证失败');
  }
};

/**
 * 权限检查中间件
 */
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return Response.unauthorized(res, '请先登录');
    }

    if (!AuthUtil.hasPermission(req.user.role, allowedRoles)) {
      return Response.forbidden(res, '权限不足');
    }

    next();
  };
};