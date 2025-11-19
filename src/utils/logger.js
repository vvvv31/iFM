// utils/logger.js - 日志工具

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDir();
  }

  /**
   * 确保日志目录存在
   */
  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * 获取当前日期字符串
   */
  getDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * 获取时间戳
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * 格式化日志消息
   */
  formatMessage(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: this.getTimestamp(),
      level,
      message,
      ...meta
    }) + '\n';
  }

  /**
   * 写入日志文件
   */
  writeLog(filename, content) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content, 'utf8');
  }

  /**
   * 控制台输出（带颜色）
   */
  consoleLog(level, message, meta = {}) {
    const colors = {
      info: '\x1b[36m',    // 青色
      warn: '\x1b[33m',    // 黄色
      error: '\x1b[31m',   // 红色
      success: '\x1b[32m', // 绿色
      reset: '\x1b[0m'
    };

    const color = colors[level] || colors.reset;
    const timestamp = new Date().toLocaleString('zh-CN');
    
    console.log(
      `${color}[${timestamp}] [${level.toUpperCase()}]${colors.reset} ${message}`,
      Object.keys(meta).length > 0 ? meta : ''
    );
  }

  /**
   * 信息日志
   */
  info(message, meta = {}) {
    this.consoleLog('info', message, meta);
    const content = this.formatMessage('INFO', message, meta);
    this.writeLog(`info-${this.getDateString()}.log`, content);
  }

  /**
   * 警告日志
   */
  warn(message, meta = {}) {
    this.consoleLog('warn', message, meta);
    const content = this.formatMessage('WARN', message, meta);
    this.writeLog(`warn-${this.getDateString()}.log`, content);
  }

  /**
   * 错误日志
   */
  error(message, error = null, meta = {}) {
    const errorInfo = error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : {};

    this.consoleLog('error', message, { ...meta, ...errorInfo });
    
    const content = this.formatMessage('ERROR', message, {
      ...meta,
      ...errorInfo
    });
    this.writeLog(`error-${this.getDateString()}.log`, content);
  }

  /**
   * 成功日志
   */
  success(message, meta = {}) {
    this.consoleLog('success', message, meta);
    const content = this.formatMessage('SUCCESS', message, meta);
    this.writeLog(`info-${this.getDateString()}.log`, content);
  }

  /**
   * 记录HTTP请求
   */
  logRequest(req, res, responseTime) {
    const log = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`
    };

    this.info('HTTP Request', log);
    
    // 单独记录访问日志
    const content = this.formatMessage('ACCESS', 'HTTP Request', log);
    this.writeLog(`access-${this.getDateString()}.log`, content);
  }

  /**
   * 记录数据库操作
   */
  logDatabase(operation, table, details = {}) {
    this.info(`Database ${operation}`, { table, ...details });
  }

  /**
   * 记录用户操作
   */
  logUserAction(userId, action, details = {}) {
    const log = {
      userId,
      action,
      ...details
    };
    
    this.info('User Action', log);
    
    // 单独记录用户行为日志
    const content = this.formatMessage('USER_ACTION', action, log);
    this.writeLog(`user-action-${this.getDateString()}.log`, content);
  }
}

// 导出单例
module.exports = new Logger();