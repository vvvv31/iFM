// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');
const userValidator = require('../validators/userValidator');

router.post('/register', validation(userValidator.registerSchema), authController.register);
router.post('/login', validation(userValidator.loginSchema), authController.login);

module.exports = router;