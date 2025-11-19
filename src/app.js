// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// 配置文件
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');

// 路由
const routes = require('./routes');

// 中间件
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// 加载环境变量
dotenv.config();

// 创建应用
const app = express();

// 安全中间件
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP最大100个请求
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 连接数据库
connectDB();
connectRedis();

// 路由配置
app.use('/api', routes);

// 根路径响应
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users'
    }
  });
});

// 错误处理
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});