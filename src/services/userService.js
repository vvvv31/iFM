// src/services/userService.js
const User = require('../models/User');

const userService = {
  async registerUser(userData) {
    // 检查用户是否存在
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // 创建新用户
    const user = await User.create(userData);
    return user;
  },
};

module.exports = userService;