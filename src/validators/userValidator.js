// src/validators/userValidator.js
const Joi = require('joi');

const userValidator = {
  registerSchema: Joi.object({
    username: Joi.string().required().min(3).max(20),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),

  loginSchema: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports = userValidator;