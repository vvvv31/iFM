// src/config/redis.js
const redis = require('redis');
const config = require('./index');

const redisClient = redis.createClient({
  url: config.redisUri,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('Redis connection error:', err);
    // Redis连接失败时不退出应用
  }
};

module.exports = { redisClient, connectRedis };