// src/utils/logger.js
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
  ],
});

// 开发环境下输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;