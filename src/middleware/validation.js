// src/middleware/validation.js
const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    next();
  };
};

module.exports = validation;