// src/routes/group.js - 合集相关路由

const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authenticate } = require('../middleware/authMiddleware');

// 合集相关路由
router.post('/create', authenticate, groupController.createGroup);
router.get('/user', authenticate, groupController.getGroupsByUser);
router.get('/:id', authenticate, groupController.getGroupById);
router.post('/add-audio', authenticate, groupController.addAudioToGroup);
router.post('/remove-audio', authenticate, groupController.removeAudioFromGroup);

module.exports = router;