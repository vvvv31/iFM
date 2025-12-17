const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI,
  redisUri: process.env.REDIS_URI,
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: 10,
};