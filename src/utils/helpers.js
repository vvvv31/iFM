// utils/helpers.js - 通用辅助函数

class Helpers {
  /**
   * 生成随机字符串
   */
  static randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 延迟函数
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 深拷贝对象
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 去除对象中的null/undefined值
   */
  static removeEmpty(obj) {
    const result = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /**
   * 格式化日期
   */
  static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const map = {
      YYYY: d.getFullYear(),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      DD: String(d.getDate()).padStart(2, '0'),
      HH: String(d.getHours()).padStart(2, '0'),
      mm: String(d.getMinutes()).padStart(2, '0'),
      ss: String(d.getSeconds()).padStart(2, '0')
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => map[matched]);
  }

  /**
   * 计算时间差（友好显示）
   */
  static timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}小时前`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}天前`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}个月前`;
    
    return `${Math.floor(diffMonths / 12)}年前`;
  }

  /**
   * 截取字符串
   */
  static truncate(str, maxLength, suffix = '...') {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength) + suffix;
  }

  /**
   * 数字格式化（千分位）
   */
  static formatNumber(num) {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 播放量格式化（1.2万、3.5亿等）
   */
  static formatPlayCount(count) {
    if (count < 10000) return count.toString();
    if (count < 100000000) return (count / 10000).toFixed(1) + '万';
    return (count / 100000000).toFixed(1) + '亿';
  }

  /**
   * 数组分页
   */
  static paginate(array, page, limit) {
    const offset = (page - 1) * limit;
    return array.slice(offset, offset + limit);
  }

  /**
   * 数组去重
   */
  static unique(array, key = null) {
    if (!key) return [...new Set(array)];
    
    const seen = new Set();
    return array.filter(item => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }

  /**
   * 数组排序（支持多字段）
   */
  static sortBy(array, key, order = 'asc') {
    return array.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      
      if (order === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
  }

  /**
   * 生成验证码
   */
  static generateCode(length = 6) {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * 10)];
    }
    return code;
  }

  /**
   * 手机号脱敏
   */
  static maskPhone(phone) {
    if (!phone || phone.length !== 11) return phone;
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  /**
   * 邮箱脱敏
   */
  static maskEmail(email) {
    if (!email) return email;
    const [name, domain] = email.split('@');
    const maskedName = name.substring(0, 2) + '***';
    return `${maskedName}@${domain}`;
  }

  /**
   * 构建树形结构（用于评论等）
   */
  static buildTree(items, parentKey = 'parent_id', idKey = 'id') {
    const map = {};
    const roots = [];

    // 创建映射
    items.forEach(item => {
      map[item[idKey]] = { ...item, children: [] };
    });

    // 构建树
    items.forEach(item => {
      const node = map[item[idKey]];
      if (item[parentKey] && map[item[parentKey]]) {
        map[item[parentKey]].children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  /**
   * 计算百分比
   */
  static percentage(part, total, decimals = 2) {
    if (!total || total === 0) return 0;
    return parseFloat(((part / total) * 100).toFixed(decimals));
  }

  /**
   * 检查是否为空对象
   */
  static isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  /**
   * 安全的JSON解析
   */
  static safeJsonParse(str, defaultValue = null) {
    try {
      return JSON.parse(str);
    } catch {
      return defaultValue;
    }
  }
}

module.exports = Helpers;