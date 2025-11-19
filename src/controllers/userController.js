// src/controllers/userController.js
const User = require('../models/User');

const userController = {
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;