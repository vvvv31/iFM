// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const authController = {
  async register(req, res, next) {
    try {
      const { username, email, phone, password } = req.body;

      // 验证至少提供了邮箱或手机号
      if (!email && !phone) {
        return res.status(400).json({ message: 'Please provide either email or phone number' });
      }

      // 检查用户是否已存在（通过邮箱或手机号）
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // 创建新用户
      const user = await User.create({ username, email, phone, password });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, phone, password } = req.body;

      // 验证至少提供了邮箱或手机号
      if (!email && !phone) {
        return res.status(400).json({ message: 'Please provide either email or phone number' });
      }

      // 检查用户是否存在（通过邮箱或手机号）
      const user = await User.findOne({ $or: [{ email }, { phone }] });
      if (!user) {
        return res.status(400).json({ message: '用户名或密码错误' });
      }

      // 检查密码是否正确
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: '用户名或密码错误' });
      }

      // 生成 JWT
      const token = jwt.sign({ user: { id: user._id } }, config.jwtSecret, {
        expiresIn: '1h',
      });

      res.json({ token });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;