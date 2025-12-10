// src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./user'));
router.use('/upload', require('./upload'));
router.use('/group', require('./group'));

module.exports = router;