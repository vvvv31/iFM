// src/validators/userValidator.js
const Joi = require('joi');

const userValidator = {
  registerSchema: Joi.object({
    username: Joi.string().required().min(3).max(20),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional(),
    password: Joi.string().required().min(6),
  }).xor('email', 'phone'), // 要求至少提供邮箱或手机号中的一个

  loginSchema: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional(),
    password: Joi.string().required(),
  }).xor('email', 'phone'), // 要求至少提供邮箱或手机号中的一个
};

module.exports = userValidator;