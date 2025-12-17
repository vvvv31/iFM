// middleware/errorMiddleware.js - 错误处理中间件

const Response = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 全局错误处理
 */
exports.errorHandler = (err, req, res, next) => {
  // 记录错误日志
  logger.error('Global Error', err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  // 数据库错误
  if (err.code === 'ER_DUP_ENTRY') {
    return Response.badRequest(res, '数据已存在');
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    return Response.badRequest(res, err.message);
  }

  // 默认服务器错误
  return Response.error(
    res,
    process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误',
    500,
    500
  );
};

/**
 * 404处理
 */
exports.notFound = (req, res) => {
  return Response.notFound(res, '请求的资源不存在');
};