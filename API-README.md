# 星之声音频平台 - 后端API调用文档

## 目录

- [项目概述]
- [环境配置]
- [核心工具类使用]
- [API接口规范]
- [前端调用示例]
- [常见问题]

------

## 项目概述

### 技术栈

- **后端**: Node.js + Express
- **数据库**: MySQL + Redis
- **认证**: JWT
- **文件处理**: Multer
- **实时通信**: Socket.io

### 项目结构

```
star-voice-backend/
├── src/
│   ├── utils/              # 核心工具类（你正在看的文档重点）
│   │   ├── auth.js         # JWT认证
│   │   ├── validator.js    # 数据验证
│   │   ├── file.js         # 文件处理
│   │   ├── audio.js        # 音频处理
│   │   ├── cache.js        # Redis缓存
│   │   ├── response.js     # 统一响应
│   │   ├── logger.js       # 日志工具
│   │   └── helpers.js      # 辅助函数
│   ├── middleware/         # 中间件
│   ├── routes/            # 路由
│   ├── controllers/       # 控制器
│   └── config/            # 配置
└── uploads/               # 上传文件
```

------

## 环境配置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改：

```bash
PORT=3000
BASE_URL=http://localhost:3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=star_voice_db

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_super_secret_key
```

### 3. 启动项目

```bash
npm run dev  # 开发环境
npm start    # 生产环境
```

------

## 核心工具类使用

### 1. Response - 统一响应格式 ⭐

所有API响应都遵循统一格式：

#### 响应结构

```javascript
{
  "code": 0,              // 0=成功，其他为错误码
  "message": "success",   // 提示信息
  "data": {},            // 返回数据
  "timestamp": 1234567890 // 时间戳
}
```

#### 后端使用

```javascript
const Response = require('../utils/response');

// ✅ 成功响应
Response.success(res, data, '操作成功');

// ❌ 错误响应
Response.error(res, '操作失败', 500);

// 🔒 未授权
Response.unauthorized(res, '请先登录');

// 🚫 权限不足
Response.forbidden(res, '没有权限');

// 📄 分页响应
Response.paginate(res, list, total, page, limit);
```

#### 前端处理

```javascript
// Axios拦截器统一处理
axios.interceptors.response.use(
  response => {
    const { code, message, data } = response.data;
    if (code === 0) {
      return data;  // 返回业务数据
    } else {
      Message.error(message);
      return Promise.reject(message);
    }
  },
  error => {
    Message.error('网络错误');
    return Promise.reject(error);
  }
);
```

------

### 2. AuthUtil - JWT认证工具 🔐

#### 后端使用

##### 生成Token

```javascript
const AuthUtil = require('../utils/auth');

// 登录成功后生成Token对
const tokens = AuthUtil.generateTokenPair({
  userId: user.user_id,
  username: user.username,
  role: user.role
});

// 返回给前端
Response.success(res, {
  accessToken: tokens.accessToken,   // 访问令牌（7天）
  refreshToken: tokens.refreshToken, // 刷新令牌（30天）
  user: userInfo
});
```

##### 验证Token（中间件）

```javascript
const { authenticate } = require('../middleware/authMiddleware');

// 需要登录的路由
router.get('/profile', authenticate, (req, res) => {
  // req.user 包含解码后的用户信息
  const userId = req.user.userId;
  // ...
});
```

##### 权限检查

```javascript
const { authorize } = require('../middleware/authMiddleware');

// 仅创作者可访问
router.post('/episode', 
  authenticate,
  authorize('creator', 'admin'),
  uploadController.createEpisode
);
```

#### 前端使用

##### 存储Token

```javascript
// 登录成功后
const { accessToken, refreshToken } = response.data;
localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);
```

##### 请求携带Token

```javascript
// Axios请求拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

##### Token过期处理

```javascript
// 响应拦截器
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token过期，尝试刷新
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        const res = await axios.post('/api/auth/refresh', { refreshToken });
        localStorage.setItem('access_token', res.data.accessToken);
        // 重试原请求
        return axios(error.config);
      } catch {
        // 刷新失败，跳转登录
        localStorage.clear();
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);
```

------

### 3. Validator - 数据验证工具 ✅

#### 后端使用

##### 注册验证

```javascript
const Validator = require('../utils/validator');

exports.register = async (req, res) => {
  // 验证注册数据
  const validation = Validator.validateRegister(req.body);
  
  if (!validation.valid) {
    return Response.badRequest(res, validation.errors.join('; '));
  }
  
  // 继续注册逻辑...
};
```

##### 自定义验证

```javascript
// 验证必填字段
const errors = Validator.validateRequired(req.body, ['title', 'content']);
if (errors.length > 0) {
  return Response.badRequest(res, errors.join('; '));
}

// 验证邮箱
if (!Validator.isEmail(email)) {
  return Response.badRequest(res, '邮箱格式不正确');
}

// 验证分页参数
const { page, limit, offset } = Validator.validatePagination(
  req.query.page, 
  req.query.limit
);
```

#### 前端验证

前端也应做基础验证，减少无效请求：

```javascript
// Element Plus表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '长度4-20位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '仅支持字母数字下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
          callback(new Error('密码需包含字母和数字'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ]
};
```

------

### 4. FileUtil - 文件处理工具 📁

#### 后端使用

##### 配置上传路由

```javascript
const { uploadAudio, uploadImage, handleUploadError } = require('../middleware/uploadMiddleware');

// 音频上传
router.post('/upload/audio', 
  authenticate,
  uploadAudio,           // 上传中间件
  handleUploadError,     // 错误处理
  uploadController.handleAudio
);

// 图片上传
router.post('/upload/image', 
  authenticate,
  uploadImage,
  handleUploadError,
  uploadController.handleImage
);
```

##### 处理上传文件

```javascript
const FileUtil = require('../utils/file');

exports.handleAudio = async (req, res) => {
  if (!req.file) {
    return Response.badRequest(res, '请上传文件');
  }
  
  // 获取文件URL
  const audioUrl = FileUtil.getFileUrl(req.file.path);
  
  // 格式化文件大小
  const fileSize = FileUtil.formatFileSize(req.file.size);
  
  // 保存到数据库...
  
  Response.success(res, {
    url: audioUrl,
    size: fileSize,
    filename: req.file.filename
  });
};
```

#### 前端使用

##### 音频上传

```vue
<template>
  <el-upload
    action="/api/upload/audio"
    :headers="{ Authorization: `Bearer ${token}` }"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :show-file-list="true"
  >
    <el-button type="primary">上传音频</el-button>
  </el-upload>
</template>

<script setup>
const token = localStorage.getItem('access_token');

const beforeUpload = (file) => {
  // 前端预验证
  const isAudio = ['audio/mpeg', 'audio/aac'].includes(file.type);
  const isLt500M = file.size / 1024 / 1024 < 500;
  
  if (!isAudio) {
    ElMessage.error('仅支持MP3、AAC格式');
    return false;
  }
  if (!isLt500M) {
    ElMessage.error('文件大小不能超过500MB');
    return false;
  }
  return true;
};

const handleSuccess = (response) => {
  if (response.code === 0) {
    ElMessage.success('上传成功');
    audioUrl.value = response.data.url;
  }
};

const handleError = (error) => {
  ElMessage.error('上传失败');
};
</script>
```

##### 使用FormData上传

```javascript
// 手动上传
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);
  formData.append('title', '我的节目');
  formData.append('channel_id', '123');
  
  try {
    const response = await axios.post('/api/upload/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`上传进度: ${percent}%`);
      }
    });
    
    console.log('上传成功:', response.data);
  } catch (error) {
    console.error('上传失败:', error);
  }
};
```

------

### 5. AudioUtil - 音频处理工具 🎵

#### 后端使用

```javascript
const AudioUtil = require('../utils/audio');

exports.processAudio = async (req, res) => {
  try {
    // 提取音频元数据
    const metadata = await AudioUtil.extractMetadata(req.file.path);
    
    // 验证音频质量
    const quality = AudioUtil.validateAudioQuality(metadata);
    if (!quality.valid) {
      await FileUtil.deleteFile(req.file.path);
      return Response.badRequest(res, quality.errors.join('; '));
    }
    
    // 格式化时长显示
    const durationText = AudioUtil.formatDuration(metadata.duration);
    
    Response.success(res, {
      duration: metadata.duration,
      durationText,  // "15:30"
      bitrate: metadata.bitrate,
      sampleRate: metadata.sampleRate
    });
  } catch (error) {
    logger.error('音频处理失败', error);
    Response.error(res, '音频文件无效');
  }
};
```

#### 前端展示

```vue
<template>
  <div class="audio-info">
    <p>时长: {{ formatDuration(duration) }}</p>
    <p>码率: {{ bitrate }}kbps</p>
    <p>采样率: {{ sampleRate }}Hz</p>
  </div>
</template>

<script setup>
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
</script>
```

------

### 6. Helpers - 辅助函数工具 🛠️

#### 后端使用

```javascript
const Helpers = require('../utils/helpers');

// 格式化播放量
const playCount = Helpers.formatPlayCount(123456); // "12.3万"

// 时间差显示
const time = Helpers.timeAgo(episode.created_at); // "3小时前"

// 手机号脱敏
const phone = Helpers.maskPhone('13812345678'); // "138****5678"

// 构建评论树
const commentTree = Helpers.buildTree(comments, 'parent_id', 'comment_id');
```

#### 前端使用

前端可以复用相同逻辑：

```javascript
// utils/helpers.js (前端)
export const formatPlayCount = (count) => {
  if (count < 10000) return count.toString();
  if (count < 100000000) return (count / 10000).toFixed(1) + '万';
  return (count / 100000000).toFixed(1) + '亿';
};

export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}天前`;
  
  return new Date(date).toLocaleDateString();
};
```

------

## API接口规范

### 基础URL

```
开发环境: http://localhost:3000/api
生产环境: https://api.starvoice.com/api
```

### 通用请求头

```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"  // 需要登录的接口
}
```

### 分页参数

```javascript
GET /api/episodes?page=1&limit=20

// 响应
{
  "code": 0,
  "data": {
    "list": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

------

## API接口列表

### 1. 用户认证

#### 1.1 用户注册

```
POST /api/auth/register
```

**请求体:**

```json
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com",
  "phone": "13812345678"
}
```

**前端代码:**

```javascript
const register = async (formData) => {
  try {
    const response = await axios.post('/api/auth/register', formData);
    if (response.data.code === 0) {
      // 保存token
      localStorage.setItem('access_token', response.data.data.accessToken);
      ElMessage.success('注册成功');
      router.push('/');
    }
  } catch (error) {
    ElMessage.error(error.response.data.message || '注册失败');
  }
};
```

**响应:**

```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "userId": 1,
      "username": "testuser",
      "role": "listener"
    }
  }
}
```

------

#### 1.2 用户登录

```
POST /api/auth/login
```

**请求体:**

```json
{
  "username": "testuser",
  "password": "password123"
}
```

**前端代码:**

```javascript
const login = async (credentials) => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;
    
    // 保存token和用户信息
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_info', JSON.stringify(user));
    
    ElMessage.success('登录成功');
    router.push('/');
  } catch (error) {
    ElMessage.error('用户名或密码错误');
  }
};
```

------

#### 1.3 刷新Token

```
POST /api/auth/refresh
```

**请求体:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

------

#### 1.4 退出登录

```
POST /api/auth/logout
需要认证: ✅
```

**前端代码:**

```javascript
const logout = async () => {
  try {
    await axios.post('/api/auth/logout');
    // 清除本地存储
    localStorage.clear();
    router.push('/login');
  } catch (error) {
    // 即使失败也清除本地数据
    localStorage.clear();
    router.push('/login');
  }
};
```

------

### 2. 用户信息

#### 2.1 获取个人信息

```
GET /api/user/profile
需要认证: ✅
```

**前端代码:**

```javascript
const getUserProfile = async () => {
  try {
    const response = await axios.get('/api/user/profile');
    userInfo.value = response.data.data;
  } catch (error) {
    ElMessage.error('获取用户信息失败');
  }
};
```

**响应:**

```json
{
  "code": 0,
  "data": {
    "userId": 1,
    "username": "testuser",
    "nickname": "测试用户",
    "avatar": "http://localhost:3000/uploads/avatars/xxx.jpg",
    "email": "test@example.com",
    "phone": "138****5678",
    "followerCount": 100,
    "followingCount": 50
  }
}
```

------

#### 2.2 更新个人信息

```
PUT /api/user/profile
需要认证: ✅
```

**请求体:**

```json
{
  "nickname": "新昵称",
  "bio": "个人简介",
  "gender": 1
}
```

**前端代码:**

```javascript
const updateProfile = async (data) => {
  try {
    await axios.put('/api/user/profile', data);
    ElMessage.success('更新成功');
  } catch (error) {
    ElMessage.error('更新失败');
  }
};
```

------

### 3. 电台管理

#### 3.1 创建电台

```
POST /api/channel
需要认证: ✅
需要权限: creator, admin
```

**请求体:**

```json
{
  "title": "我的电台",
  "description": "电台简介",
  "categoryId": 1
}
```

**前端代码:**

```vue
<template>
  <el-form :model="form" @submit.prevent="createChannel">
    <el-form-item label="电台名称">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="简介">
      <el-input type="textarea" v-model="form.description" />
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="form.categoryId">
        <el-option v-for="cat in categories" :key="cat.id" 
                   :label="cat.name" :value="cat.id" />
      </el-select>
    </el-form-item>
    <el-button type="primary" native-type="submit">创建</el-button>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
  title: '',
  description: '',
  categoryId: null
});

const createChannel = async () => {
  try {
    const response = await axios.post('/api/channel', form.value);
    ElMessage.success('创建成功');
    router.push(`/channel/${response.data.data.channelId}`);
  } catch (error) {
    ElMessage.error(error.response.data.message);
  }
};
</script>
```

------

#### 3.2 获取电台列表

```
GET /api/channels?page=1&limit=20&categoryId=1
```

**前端代码:**

```javascript
const getChannels = async (params) => {
  try {
    const response = await axios.get('/api/channels', { params });
    channels.value = response.data.data.list;
    pagination.value = response.data.data.pagination;
  } catch (error) {
    ElMessage.error('获取失败');
  }
};

// 使用
getChannels({ page: 1, limit: 20, categoryId: 1 });
```

------

### 4. 节目管理

#### 4.1 上传节目

```
POST /api/episode
需要认证: ✅
Content-Type: multipart/form-data
```

**前端代码（完整示例）:**

```vue
<template>
  <div class="upload-page">
    <el-form :model="form" label-width="100px">
      <el-form-item label="选择电台">
        <el-select v-model="form.channelId">
          <el-option v-for="ch in myChannels" :key="ch.id" 
                     :label="ch.title" :value="ch.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="节目标题">
        <el-input v-model="form.title" placeholder="请输入节目标题" />
      </el-form-item>

      <el-form-item label="节目简介">
        <el-input type="textarea" v-model="form.description" 
                  :rows="4" placeholder="请输入节目简介" />
      </el-form-item>

      <el-form-item label="上传音频">
        <el-upload
          ref="uploadRef"
          action="/api/upload/audio"
          :headers="{ Authorization: `Bearer ${token}` }"
          :on-success="handleAudioSuccess"
          :on-error="handleError"
          :before-upload="beforeAudioUpload"
          :on-progress="handleProgress"
          :limit="1"
        >
          <el-button type="primary">选择音频文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              支持MP3、AAC格式，大小不超过500MB
            </div>
          </template>
        </el-upload>
        
        <!-- 上传进度 -->
        <el-progress v-if="uploading" :percentage="uploadProgress" />
      </el-form-item>

      <el-form-item label="封面图片">
        <el-upload
          action="/api/upload/image"
          :headers="{ Authorization: `Bearer ${token}` }"
          :on-success="handleCoverSuccess"
          :show-file-list="false"
          list-type="picture-card"
        >
          <img v-if="form.coverImage" :src="form.coverImage" class="cover" />
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitEpisode" 
                   :loading="submitting" :disabled="!audioUrl">
          发布节目
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const token = localStorage.getItem('access_token');
const myChannels = ref([]);
const uploading = ref(false);
const uploadProgress = ref(0);
const submitting = ref(false);
const audioUrl = ref('');

const form = ref({
  channelId: null,
  title: '',
  description: '',
  coverImage: ''
});

// 加载我的电台列表
onMounted(async () => {
  const res = await axios.get('/api/user/channels');
  myChannels.value = res.data.data;
});

// 音频上传前验证
const beforeAudioUpload = (file) => {
  const isAudio = ['audio/mpeg', 'audio/aac', 'audio/mp4'].includes(file.type);
  const isLt500M = file.size / 1024 / 1024 < 500;
  
  if (!isAudio) {
    ElMessage.error('仅支持MP3、AAC格式');
    return false;
  }
  if (!isLt500M) {
    ElMessage.error('文件大小不能超过500MB');
    return false;
  }
  
  uploading.value = true;
  return true;
};

// 上传进度
const handleProgress = (event) => {
  uploadProgress.value = Math.round((event.loaded / event.total) * 100);
};

// 音频上传成功
const handleAudioSuccess = (response) => {
  uploading.value = false;
  if (response.code === 0) {
    audioUrl.value = response.data.url;
    // 自动填充时长等信息
    form.value.duration = response.data.duration;
    ElMessage.success('音频上传成功');
  }
};

// 封面上传成功
const handleCoverSuccess = (response) => {
  if (response.code === 0) {
    form.value.coverImage = response.data.url;
  }
};

// 上传失败
const handleError = (error) => {
  uploading.value = false;
  ElMessage.error('上传失败，请重试');
};

// 提交节目
const submitEpisode = async () => {
  if (!form.value.channelId) {
    ElMessage.warning('请选择电台');
    return;
  }
  if (!form.value.title) {
    ElMessage.warning('请输入节目标题');
    return;
  }
  if (!audioUrl.value) {
    ElMessage.warning('请上传音频文件');
    return;
  }

  submitting.value = true;
  try {
    const response = await axios.post('/api/episode', {
      ...form.value,
      audioUrl: audioUrl.value
    });
    
    ElMessage.success('发布成功');
    router.push(`/episode/${response.data.data.episodeId}`);
  } catch (error) {
    ElMessage.error(error.response.data.message || '发布失败');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
```

------

#### 4.2 获取节目列表

```
GET /api/episodes?page=1&limit=20
```

**前端代码:**

```vue
<template>
  <div class="episodes-list">
    <el-card v-for="ep in episodes" :key="ep.episodeId" class="episode-card">
      <div class="episode-info">
        <img :src="ep.coverImage" class="cover" />
        <div class="info">
          <h3>{{ ep.title }}</h3>
          <p>{{ ep.description }}</p>
          <div class="meta">
            <span>{{ formatDuration(ep.duration) }}</span>
            <span>{{ formatPlayCount(ep.playCount) }}次播放</span>
            <span>{{ timeAgo(ep.createdAt) }}</span>
          </div>
        </div>
        <el-button type="primary" @click="playEpisode(ep)">播放</el-button>
      </div>
    </el-card>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      @current-change="loadEpisodes"
      layout="prev, pager, next, total"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const episodes = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

const loadEpisodes = async () => {
  try {
    const response = await axios.get('/api/episodes', {
      params: {
        page: currentPage.value,
        limit: pageSize.value
      }
    });
    
    episodes.value = response.data.data.list;
    total.value = response.data.data.pagination.total;
  } catch (error) {
    ElMessage.error('加载失败');
  }
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatPlayCount = (count) => {
  if (count < 10000) return count;
  if (count < 100000000) return (count / 10000).toFixed(1) + '万';
  return (count / 100000000).toFixed(1) + '亿';
};

const timeAgo = (date) => {
  // 实现时间差显示逻辑
  return '2小时前';
};

const playEpisode = (episode) => {
  router.push(`/player/${episode.episodeId}`);
};

onMounted(() => {
  loadEpisodes();
});
</script>
```

------

#### 4.3 获取节目详情

```
GET /api/episode/:id
```

**前端代码:**

```javascript
const getEpisodeDetail = async (episodeId) => {
  try {
    const response = await axios.get(`/api/episode/${episodeId}`);
    episode.value = response.data.data;
  } catch (error) {
    ElMessage.error('节目不存在');
  }
};
```

**响应:**

```json
{
  "code": 0,
  "data": {
    "episodeId": 1,
    "channelId": 1,
    "title": "节目标题",
    "description": "节目简介",
    "audioUrl": "http://localhost:3000/uploads/audios/xxx.mp3",
    "coverImage": "http://localhost:3000/uploads/covers/xxx.jpg",
    "duration": 1800,
    "playCount": 12345,
    "likeCount": 100,
    "commentCount": 50,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "channel": {
      "channelId": 1,
      "title": "电台名称",
      "creator": {
        "userId": 1,
        "username": "creator",
        "nickname": "创作者"
      }
    }
  }
}
```

------

### 5. 音频播放器

#### 5.1 播放器组件（前端）

```vue
<template>
  <div class="audio-player">
    <audio ref="audioRef" 
           :src="currentAudio?.audioUrl"
           @timeupdate="updateProgress"
           @loadedmetadata="onAudioLoaded"
           @ended="onAudioEnded"
           @error="onAudioError"
    ></audio>

    <div class="player-controls">
      <!-- 播放/暂停按钮 -->
      <el-button 
        :icon="isPlaying ? VideoPause : VideoPlay"
        circle
        @click="togglePlay"
      />

      <!-- 进度条 -->
      <div class="progress-bar">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <el-slider 
          v-model="progress" 
          :show-tooltip="false"
          @change="seekAudio"
        />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <!-- 音量控制 -->
      <div class="volume-control">
        <el-icon @click="toggleMute">
          <component :is="isMuted ? Mute : MicrophoneFilled" />
        </el-icon>
        <el-slider 
          v-model="volume" 
          :show-tooltip="false"
          @change="changeVolume"
          style="width: 100px"
        />
      </div>

      <!-- 播放速度 -->
      <el-select v-model="playbackRate" @change="changeSpeed" style="width: 80px">
        <el-option label="0.5x" :value="0.5" />
        <el-option label="0.75x" :value="0.75" />
        <el-option label="1.0x" :value="1.0" />
        <el-option label="1.25x" :value="1.25" />
        <el-option label="1.5x" :value="1.5" />
        <el-option label="2.0x" :value="2.0" />
      </el-select>
    </div>

    <!-- 节目信息 -->
    <div class="episode-info" v-if="currentAudio">
      <img :src="currentAudio.coverImage" class="cover" />
      <div class="info">
        <h4>{{ currentAudio.title }}</h4>
        <p>{{ currentAudio.channel?.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { VideoPlay, VideoPause, MicrophoneFilled, Mute } from '@element-plus/icons-vue';

const props = defineProps({
  episode: Object
});

const audioRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const volume = ref(80);
const isMuted = ref(false);
const playbackRate = ref(1.0);
const currentAudio = ref(null);

// 监听传入的节目变化
watch(() => props.episode, (newEpisode) => {
  if (newEpisode) {
    currentAudio.value = newEpisode;
    loadAudio();
  }
});

// 加载音频
const loadAudio = () => {
  if (audioRef.value) {
    audioRef.value.load();
  }
};

// 播放/暂停
const togglePlay = () => {
  if (!audioRef.value) return;
  
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

// 更新进度
const updateProgress = () => {
  if (!audioRef.value) return;
  
  currentTime.value = audioRef.value.currentTime;
  progress.value = (currentTime.value / duration.value) * 100;
  
  // 每30秒上报播放进度（用于统计）
  if (Math.floor(currentTime.value) % 30 === 0) {
    reportProgress();
  }
};

// 拖动进度条
const seekAudio = (value) => {
  if (!audioRef.value) return;
  const seekTime = (value / 100) * duration.value;
  audioRef.value.currentTime = seekTime;
};

// 改变音量
const changeVolume = (value) => {
  if (!audioRef.value) return;
  audioRef.value.volume = value / 100;
  isMuted.value = value === 0;
};

// 静音/取消静音
const toggleMute = () => {
  if (!audioRef.value) return;
  isMuted.value = !isMuted.value;
  audioRef.value.muted = isMuted.value;
};

// 改变播放速度
const changeSpeed = (rate) => {
  if (!audioRef.value) return;
  audioRef.value.playbackRate = rate;
};

// 音频加载完成
const onAudioLoaded = () => {
  duration.value = audioRef.value.duration;
  audioRef.value.volume = volume.value / 100;
};

// 音频播放结束
const onAudioEnded = () => {
  isPlaying.value = false;
  progress.value = 0;
  currentTime.value = 0;
  
  // 上报播放完成
  reportPlayComplete();
};

// 音频错误
const onAudioError = (error) => {
  ElMessage.error('音频加载失败');
  console.error('Audio error:', error);
};

// 格式化时间
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 上报播放进度（统计用）
const reportProgress = async () => {
  try {
    await axios.post('/api/episode/progress', {
      episodeId: currentAudio.value.episodeId,
      currentTime: currentTime.value
    });
  } catch (error) {
    console.error('上报进度失败');
  }
};

// 上报播放完成
const reportPlayComplete = async () => {
  try {
    await axios.post('/api/episode/complete', {
      episodeId: currentAudio.value.episodeId
    });
  } catch (error) {
    console.error('上报播放完成失败');
  }
};
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 10px 20px;
  z-index: 1000;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.time {
  font-size: 12px;
  color: #666;
  min-width: 45px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.episode-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

.info h4 {
  margin: 0;
  font-size: 14px;
}

.info p {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
```

------

### 6. 社区互动

#### 6.1 发布评论

```
POST /api/comment
需要认证: ✅
```

**请求体:**

```json
{
  "targetType": "episode",
  "targetId": 1,
  "content": "很棒的节目！",
  "parentId": null  // 回复评论时填写父评论ID
}
```

**前端代码:**

```vue
<template>
  <div class="comment-section">
    <!-- 评论输入框 -->
    <div class="comment-input">
      <el-input
        v-model="commentText"
        type="textarea"
        :rows="3"
        placeholder="写下你的评论..."
      />
      <el-button type="primary" @click="submitComment">发表评论</el-button>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.commentId" class="comment-item">
        <div class="comment-header">
          <img :src="comment.user.avatar" class="avatar" />
          <div class="user-info">
            <span class="username">{{ comment.user.nickname }}</span>
            <span class="time">{{ timeAgo(comment.createdAt) }}</span>
          </div>
        </div>
        
        <div class="comment-content">{{ comment.content }}</div>
        
        <div class="comment-actions">
          <el-button text @click="likeComment(comment)">
            <el-icon><Star /></el-icon>
            {{ comment.likeCount }}
          </el-button>
          <el-button text @click="replyComment(comment)">回复</el-button>
        </div>

        <!-- 回复列表 -->
        <div v-if="comment.children?.length" class="replies">
          <div v-for="reply in comment.children" :key="reply.commentId" class="reply-item">
            <span class="username">{{ reply.user.nickname }}</span>
            回复
            <span class="username">{{ comment.user.nickname }}</span>:
            {{ reply.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  targetType: String,  // 'episode' 或 'channel'
  targetId: Number
});

const commentText = ref('');
const comments = ref([]);

// 加载评论
const loadComments = async () => {
  try {
    const response = await axios.get('/api/comments', {
      params: {
        targetType: props.targetType,
        targetId: props.targetId
      }
    });
    comments.value = response.data.data;
  } catch (error) {
    ElMessage.error('加载评论失败');
  }
};

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim()) {
    ElMessage.warning('请输入评论内容');
    return;
  }

  try {
    await axios.post('/api/comment', {
      targetType: props.targetType,
      targetId: props.targetId,
      content: commentText.value
    });
    
    commentText.value = '';
    ElMessage.success('评论成功');
    loadComments();
  } catch (error) {
    ElMessage.error('评论失败');
  }
};

// 点赞评论
const likeComment = async (comment) => {
  try {
    await axios.post(`/api/comment/${comment.commentId}/like`);
    comment.likeCount++;
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 回复评论
const replyComment = (comment) => {
  // 实现回复逻辑
};

onMounted(() => {
  loadComments();
});
</script>
```

------

#### 6.2 点赞节目

```
POST /api/episode/:id/like
需要认证: ✅
```

**前端代码:**

```javascript
const likeEpisode = async (episodeId) => {
  try {
    await axios.post(`/api/episode/${episodeId}/like`);
    ElMessage.success('已点赞');
    episode.value.likeCount++;
  } catch (error) {
    ElMessage.error('操作失败');
  }
};
```

------

#### 6.3 收藏节目

```
POST /api/episode/:id/favorite
需要认证: ✅
```

------

#### 6.4 订阅电台

```
POST /api/channel/:id/subscribe
需要认证: ✅
```

**前端代码:**

```javascript
const subscribeChannel = async (channelId) => {
  try {
    await axios.post(`/api/channel/${channelId}/subscribe`);
    ElMessage.success('订阅成功');
    channel.value.isSubscribed = true;
  } catch (error) {
    ElMessage.error('订阅失败');
  }
};
```

------

### 7. 直播系统

#### 7.1 创建直播房间

```
POST /api/live/room
需要认证: ✅
需要权限: creator, admin
```

**请求体:**

```json
{
  "title": "深夜电台",
  "description": "聊聊生活",
  "coverImage": "http://..."
}
```

------

#### 7.2 Socket.io 直播连接（前端）

```javascript
// socket.js - Socket连接管理
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  // 连接Socket
  connect() {
    const token = localStorage.getItem('access_token');
    
    this.socket = io(process.env.VUE_APP_SOCKET_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket连接成功');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket断开连接');
    });

    this.socket.on('error', (error) => {
      console.error('Socket错误:', error);
    });
  }

  // 加入直播间
  joinRoom(roomId) {
    this.socket.emit('join-live', roomId);
  }

  // 离开直播间
  leaveRoom(roomId) {
    this.socket.emit('leave-live', roomId);
  }

  // 发送弹幕
  sendDanmaku(roomId, content) {
    this.socket.emit('send-danmaku', {
      roomId,
      content
    });
  }

  // 监听弹幕
  onDanmaku(callback) {
    this.socket.on('new-danmaku', callback);
  }

  // 监听观众变化
  onAudienceChange(callback) {
    this.socket.on('audience-change', callback);
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
```

**直播间组件:**

```vue
<template>
  <div class="live-room">
    <div class="room-header">
      <h2>{{ room.title }}</h2>
      <div class="audience-count">
        <el-icon><User /></el-icon>
        {{ audienceCount }}
      </div>
    </div>

    <!-- 音频播放器 -->
    <audio ref="audioRef" autoplay></audio>

    <!-- 弹幕区域 -->
    <div class="danmaku-container" ref="danmakuRef">
      <div v-for="dm in danmakus" :key="dm.id" class="danmaku">
        <span class="username">{{ dm.user.nickname }}:</span>
        {{ dm.content }}
      </div>
    </div>

    <!-- 弹幕输入 -->
    <div class="danmaku-input">
      <el-input
        v-model="danmakuText"
        placeholder="发送弹幕..."
        @keyup.enter="sendDanmaku"
      />
      <el-button type="primary" @click="sendDanmaku">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import socketService from '@/utils/socket';

const route = useRoute();
const roomId = route.params.id;

const room = ref({});
const audienceCount = ref(0);
const danmakus = ref([]);
const danmakuText = ref('');
const audioRef = ref(null);

// 加载直播间信息
const loadRoom = async () => {
  const response = await axios.get(`/api/live/room/${roomId}`);
  room.value = response.data.data;
};

// 发送弹幕
const sendDanmaku = () => {
  if (!danmakuText.value.trim()) return;
  
  socketService.sendDanmaku(roomId, danmakuText.value);
  danmakuText.value = '';
};

onMounted(async () => {
  await loadRoom();
  
  // 连接Socket
  socketService.connect();
  socketService.joinRoom(roomId);
  
  // 监听弹幕
  socketService.onDanmaku((data) => {
    danmakus.value.push(data);
    // 保持最近50条
    if (danmakus.value.length > 50) {
      danmakus.value.shift();
    }
  });
  
  // 监听观众数变化
  socketService.onAudienceChange((count) => {
    audienceCount.value = count;
  });
});

onUnmounted(() => {
  socketService.leaveRoom(roomId);
  socketService.disconnect();
});
</script>
```

------

### 8. 搜索功能

#### 8.1 综合搜索

```
GET /api/search?keyword=关键词&type=episode&page=1&limit=20
```

**参数说明:**

- `keyword`: 搜索关键词（必填）
- `type`: 搜索类型（`episode`, `channel`, `user`）
- `page`: 页码
- `limit`: 每页数量

**前端代码:**

```vue
<template>
  <div class="search-page">
    <el-input
      v-model="keyword"
      placeholder="搜索节目、电台、用户..."
      @keyup.enter="search"
    >
      <template #append>
        <el-button :icon="Search" @click="search" />
      </template>
    </el-input>

    <el-tabs v-model="activeTab" @tab-change="search">
      <el-tab-pane label="节目" name="episode"></el-tab-pane>
      <el-tab-pane label="电台" name="channel"></el-tab-pane>
      <el-tab-pane label="用户" name="user"></el-tab-pane>
    </el-tabs>

    <div class="search-results">
      <div v-if="loading">加载中...</div>
      <div v-else-if="results.length === 0">暂无结果</div>
      <div v-else>
        <!-- 显示搜索结果 -->
        <div v-for="item in results" :key="item.id" class="result-item">
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const keyword = ref('');
const activeTab = ref('episode');
const results = ref([]);
const loading = ref(false);

const search = async () => {
  if (!keyword.value.trim()) return;
  
  loading.value = true;
  try {
    const response = await axios.get('/api/search', {
      params: {
        keyword: keyword.value,
        type: activeTab.value,
        page: 1,
        limit: 20
      }
    });
    
    results.value = response.data.data.list;
  } catch (error) {
    ElMessage.error('搜索失败');
  } finally {
    loading.value = false;
  }
};
</script>
```

------

## 前端调用示例

### 完整的Axios配置

```javascript
// axios.js - 统一配置
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加Token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { code, message, data } = response.data;
    
    // 成功
    if (code === 0) {
      return data;
    }
    
    // 业务错误
    ElMessage.error(message || '操作失败');
    return Promise.reject(new Error(message));
  },
  async error => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token过期，尝试刷新
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const res = await axios.post('/api/auth/refresh', { refreshToken });
              localStorage.setItem('access_token', res.data.accessToken);
              // 重试原请求
              return service(error.config);
            } catch {
              // 刷新失败，跳转登录
              localStorage.clear();
              router.push('/login');
            }
          } else {
            ElMessage.error('请先登录');
            router.push('/login');
          }
          break;
          
        case 403:
          ElMessage.error('权限不足');
          break;
          
        case 404:
          ElMessage.error('资源不存在');
          break;
          
        case 500:
          ElMessage.error('服务器错误');
          break;
          
        default:
          ElMessage.error(data?.message || '网络错误');
      }
    } else {
      ElMessage.error('网络连接失败');
    }
    
    return Promise.reject(error);
  }
);

export default service;
```

------

## 常见问题

### Q1: 如何处理文件上传进度？

```javascript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);
  
  try {
    const response = await axios.post('/api/upload/audio', formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`上传进度: ${percent}%`);
        // 更新UI进度条
        uploadProgress.value = percent;
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('上传失败:', error);
  }
};
```

------

### Q2: 如何实现离线下载功能？

后端提供下载接口：

```javascript
// 后端
router.get('/api/episode/:id/download', authenticate, async (req, res) => {
  const episode = await Episode.findById(req.params.id);
  const filePath = path.join(__dirname, '../uploads/audios', episode.filename);
  
  res.download(filePath, `${episode.title}.mp3`, (err) => {
    if (err) {
      logger.error('下载失败', err);
    }
  });
});
```

前端触发下载：

```javascript
const downloadEpisode = (episode) => {
  const token = localStorage.getItem('access_token');
  const url = `/api/episode/${episode.episodeId}/download`;
  
  // 创建隐藏的a标签
  const link = document.createElement('a');
  link.href = url + `?token=${token}`;
  link.download = `${episode.title}.mp3`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  ElMessage.success('开始下载');
};
```

------

### Q3: 如何实现播放历史记录？

后端记录播放历史：

```javascript
// POST /api/user/history
exports.addHistory = async (req, res) => {
  const { episodeId, currentTime } = req.body;
  const userId = req.user.userId;
  
  // 保存或更新播放记录
  await PlayHistory.upsert({
    userId,
    episodeId,
    currentTime,
    lastPlayAt: new Date()
  });
  
  Response.success(res, null, '保存成功');
};
```

前端定时保存：

```javascript
// 每30秒保存一次播放进度
setInterval(() => {
  if (isPlaying.value && currentTime.value > 0) {
    axios.post('/api/user/history', {
      episodeId: currentEpisode.value.episodeId,
      currentTime: currentTime.value
    });
  }
}, 30000);
```

------

### Q4: 如何实现实时通知？

使用Socket.io实现：

```javascript
// 后端发送通知
io.to(userId).emit('notification', {
  type: 'new_comment',
  message: '有人评论了你的节目',
  data: {
    episodeId: 1,
    commentId: 123
  }
});
<!-- 前端接收通知 -->
<script setup>
import { ref, onMounted } from 'vue';
import socketService from '@/utils/socket';

const notifications = ref([]);

onMounted(() => {
  socketService.connect();
  
  // 监听通知
  socketService.socket.on('notification', (data) => {
    notifications.value.unshift(data);
    
    // 显示提示
    ElNotification({
      title: '新消息',
      message: data.message,
      type: 'info'
    });
  });
});
</script>
```

------

### Q5: 如何处理大文件分片上传？

前端分片：

```javascript
const chunkSize = 5 * 1024 * 1024; // 5MB每片

const uploadChunks = async (file) => {
  const chunks = Math.ceil(file.size / chunkSize);
  const fileHash = await calculateHash(file); // 计算文件hash
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', i);
    formData.append('totalChunks', chunks);
    formData.append('fileHash', fileHash);
    
    await axios.post('/api/upload/chunk', formData);
  }
  
  // 通知服务器合并文件
  await axios.post('/api/upload/merge', {
    fileHash,
    filename: file.name,
    totalChunks: chunks
  });
};
```

------

### Q6: 如何实现数据缓存？

使用Pinia进行全局状态管理：

```javascript
// stores/episode.js
import { defineStore } from 'pinia';
import axios from '@/utils/axios';

export const useEpisodeStore = defineStore('episode', {
  state: () => ({
    hotEpisodes: [],
    cache: new Map()
  }),
  
  actions: {
    async getHotEpisodes() {
      // 检查缓存
      if (this.hotEpisodes.length > 0) {
        return this.hotEpisodes;
      }
      
      // 从服务器获取
      const data = await axios.get('/api/episodes/hot');
      this.hotEpisodes = data.list;
      return data.list;
    },
    
    async getEpisode(id) {
      // 检查缓存
      if (this.cache.has(id)) {
        return this.cache.get(id);
      }
      
      // 从服务器获取
      const data = await axios.get(`/api/episode/${id}`);
      this.cache.set(id, data);
      return data;
    }
  }
});
```

------

## 错误码对照表

| 错误码 | 说明             | HTTP状态码 |
| ------ | ---------------- | ---------- |
| 0      | 成功             | 200        |
| 400    | 请求参数错误     | 400        |
| 401    | 未授权/Token无效 | 401        |
| 403    | 权限不足         | 403        |
| 404    | 资源不存在       | 404        |
| 500    | 服务器内部错误   | 500        |

------

## 环境变量配置（前端）

```bash
# .env.development
VUE_APP_BASE_URL=http://localhost:3000/api
VUE_APP_SOCKET_URL=http://localhost:3000
VUE_APP_UPLOAD_URL=http://localhost:3000

# .env.production
VUE_APP_BASE_URL=https://api.starvoice.com/api
VUE_APP_SOCKET_URL=https://api.starvoice.com
VUE_APP_UPLOAD_URL=https://cdn.starvoice.com
```

------

## 调试技巧

### 1. 使用浏览器开发者工具

**Network面板查看请求:**

- 检查请求URL是否正确
- 查看请求头是否包含Token
- 检查请求体数据格式
- 查看响应状态码和数据

**Console面板调试:**

```javascript
// 在控制台查看请求响应
console.log('请求参数:', params);
console.log('响应数据:', response.data);
```

### 2. 使用Vue Devtools

- 查看Pinia状态
- 监控组件Props变化
- 调试Socket事件

### 3. 后端日志查看

```bash
# 实时查看日志
tail -f logs/info-2024-01-01.log
tail -f logs/error-2024-01-01.log

# 搜索特定用户的日志
grep "userId: 123" logs/user-action-*.log
```

------

## API测试工具

### Postman集合配置

```json
{
  "info": {
    "name": "星之声API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ]
}
```

**使用步骤:**

1. 先调用登录接口获取token
2. 将token保存到环境变量`access_token`
3. 其他需要认证的接口会自动使用这个token

------

## 性能优化建议

### 前端优化

1. **图片懒加载**

```vue
<img v-lazy="episode.coverImage" />
```

1. **列表虚拟滚动**

```vue
<el-virtual-scroll :items="episodes" :item-height="80">
  <template #default="{ item }">
    <EpisodeCard :episode="item" />
  </template>
</el-virtual-scroll>
```

1. **路由懒加载**

```javascript
const routes = [
  {
    path: '/episode/:id',
    component: () => import('@/views/Episode.vue')
  }
];
```

1. **防抖与节流**

```javascript
import { debounce } from 'lodash-es';

const search = debounce((keyword) => {
  // 搜索逻辑
}, 500);
```

### 后端优化

1. **使用Redis缓存热点数据**

```javascript
// 缓存热门节目
const hotEpisodes = await cache.get('hot_episodes');
if (!hotEpisodes) {
  const data = await Episode.getHot();
  await cache.set('hot_episodes', data, 3600);
  return data;
}
return hotEpisodes;
```

1. **数据库查询优化**

```javascript
// 使用索引
// 限制查询字段
// 分页查询
const episodes = await Episode.findAll({
  attributes: ['id', 'title', 'coverImage', 'duration'],
  limit: 20,
  offset: (page - 1) * 20
});
```

------

## 联系与支持

- **后端负责人**: [姓名] - [邮箱]
- **前端负责人**: [姓名] - [邮箱]
- **项目文档**: [文档地址]
- **问题反馈**: [Issue地址]

------

## 更新日志

### v1.0.0 (2024-01-01)

- ✅ 完成用户认证系统
- ✅ 完成音频上传功能
- ✅ 完成播放器基础功能
- ✅ 完成评论互动系统

### 待开发功能

- ⏳ 直播连麦功能
- ⏳ 支付系统
- ⏳ 数据统计后台
- ⏳ 移动端适配

------

**最后更新时间**: 2025-11-18
 **文档版本**: v1.0
