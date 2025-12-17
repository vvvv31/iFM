// config/constants.js - 项目常量配置

module.exports = {
  // 用户角色
  USER_ROLES: {
    LISTENER: 'listener',
    CREATOR: 'creator',
    ADMIN: 'admin'
  },

  // 用户状态
  USER_STATUS: {
    DISABLED: 0,
    ACTIVE: 1
  },

  // 节目状态
  EPISODE_STATUS: {
    OFFLINE: 0,
    ONLINE: 1,
    REVIEWING: 2
  },

  // 直播状态
  LIVE_STATUS: {
    OFFLINE: 'offline',
    LIVE: 'live',
    PAUSE: 'pause'
  },

  // 音频文件配置
  AUDIO: {
    MAX_SIZE: 500 * 1024 * 1024, // 500MB
    ALLOWED_FORMATS: ['mp3', 'aac', 'm4a'],
    MIME_TYPES: ['audio/mpeg', 'audio/aac', 'audio/mp4'],
    MIN_BITRATE: 128, // kbps
    MAX_BITRATE: 320  // kbps
  },

  // 图片文件配置
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
    MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp']
  },

  // JWT配置
  JWT: {
    ACCESS_TOKEN_EXPIRES: '7d',
    REFRESH_TOKEN_EXPIRES: '30d'
  },

  // Redis键前缀
  REDIS_KEYS: {
    USER_TOKEN: 'user:token:',
    USER_INFO: 'user:info:',
    EPISODE_INFO: 'episode:info:',
    HOT_EPISODES: 'hot:episodes',
    LIVE_ROOM: 'live:room:'
  },

  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // 错误码
  ERROR_CODES: {
    SUCCESS: 0,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
};