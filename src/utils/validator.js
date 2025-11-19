// utils/validator.js - 数据验证工具

const { PAGINATION } = require('../config/constants');

class Validator {
  /**
   * 验证邮箱格式
   */
  static isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * 验证手机号格式（中国大陆）
   */
  static isPhone(phone) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
  }

  /**
   * 验证密码强度（至少6位，包含字母和数字）
   */
  static isStrongPassword(password) {
    if (password.length < 6) return false;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
  }

  /**
   * 验证用户名（4-20位，字母数字下划线）
   */
  static isUsername(username) {
    const regex = /^[a-zA-Z0-9_]{4,20}$/;
    return regex.test(username);
  }

  /**
   * 验证必填字段
   */
  static validateRequired(data, fields) {
    const errors = [];
    fields.forEach(field => {
      if (!data[field] || data[field].toString().trim() === '') {
        errors.push(`${field}不能为空`);
      }
    });
    return errors;
  }

  /**
   * 验证分页参数
   */
  static validatePagination(page, limit) {
    const validPage = parseInt(page) || PAGINATION.DEFAULT_PAGE;
    let validLimit = parseInt(limit) || PAGINATION.DEFAULT_LIMIT;
    
    if (validLimit > PAGINATION.MAX_LIMIT) {
      validLimit = PAGINATION.MAX_LIMIT;
    }
    
    return {
      page: Math.max(1, validPage),
      limit: Math.max(1, validLimit),
      offset: (Math.max(1, validPage) - 1) * validLimit
    };
  }

  /**
   * 验证注册数据
   */
  static validateRegister(data) {
    const errors = [];

    // 必填字段
    const required = this.validateRequired(data, ['username', 'password']);
    if (required.length > 0) return { valid: false, errors: required };

    // 用户名格式
    if (!this.isUsername(data.username)) {
      errors.push('用户名格式不正确（4-20位字母数字下划线）');
    }

    // 密码强度
    if (!this.isStrongPassword(data.password)) {
      errors.push('密码至少6位，需包含字母和数字');
    }

    // 邮箱格式（如果提供）
    if (data.email && !this.isEmail(data.email)) {
      errors.push('邮箱格式不正确');
    }

    // 手机号格式（如果提供）
    if (data.phone && !this.isPhone(data.phone)) {
      errors.push('手机号格式不正确');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证节目上传数据
   */
  static validateEpisode(data) {
    const errors = [];

    const required = this.validateRequired(data, ['channel_id', 'title', 'duration']);
    if (required.length > 0) return { valid: false, errors: required };

    if (data.title.length > 100) {
      errors.push('标题不能超过100字符');
    }

    if (data.duration && (isNaN(data.duration) || data.duration <= 0)) {
      errors.push('时长必须为正数');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 清理XSS攻击字符
   */
  static sanitize(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

module.exports = Validator;