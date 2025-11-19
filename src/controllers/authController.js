// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const authController = {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // 检查用户是否存在
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // 创建新用户
      const user = await User.create({ username, email, password });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // 检查用户是否存在
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // 检查密码是否正确
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
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