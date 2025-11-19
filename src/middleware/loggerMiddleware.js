// middleware/loggerMiddleware.js - 请求日志中间件

const logger = require('../utils/logger');

/**
 * 记录HTTP请求
 */
exports.requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // 监听响应完成
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logger.logRequest(req, res, responseTime);
  });

  next();
};