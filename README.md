# IFM-Service - 外语播客管理系统后端服务

## 项目介绍
IFM-Service是一个外语播客管理系统的后端服务，提供用户管理、音频管理、文件上传等功能。

## 技术栈
- Java 17
- Spring Boot 3.0.2
- Spring Data JPA
- MySQL
- Maven

## 启动前准备

### 1. 安装依赖
确保您已安装以下软件：
- JDK 17
- Maven
- MySQL 8.0+

### 2. 数据库配置
1. 启动MySQL服务
2. 创建名为`ifm_service`的数据库
3. 确保数据库用户名为`root`，密码为`root`（或修改`application.yml`中的数据库配置）

### 3. 配置文件
主要配置文件位于`src/main/resources/application.yml`，包含以下主要配置：
- 数据库连接信息
- 文件上传路径
- JPA配置

## 构建与启动

### 1. 构建项目
```bash
mvn clean package -DskipTests
```

### 2. 启动应用
```bash
java -jar target/ifm-service-0.0.1-SNAPSHOT.jar
```

### 3. 访问API文档
应用启动后，可通过以下地址访问Swagger UI：
```
http://localhost:8080/swagger-ui.html
```

## 功能模块

### 1. 用户管理
- 用户注册
- 用户登录
- 用户信息查询与更新

### 2. 音频管理
- 创建音频
- 获取音频详情
- 更新音频信息
- 删除音频
- 音频分类与搜索
- 播放次数与点赞管理

### 3. 文件上传
- 音频文件上传
- 封面图片上传

## 项目结构

```
├── src/
│   ├── main/
│   │   ├── java/com/zjsu/yyd/ifmservice/
│   │   │   ├── controller/    # 控制器层
│   │   │   ├── model/         # 数据模型
│   │   │   ├── repository/    # 数据访问层
│   │   │   ├── service/       # 业务逻辑层
│   │   │   └── IfmServiceApplication.java  # 应用入口
│   │   └── resources/         # 配置文件
│   └── test/                  # 测试代码
├── uploads/                   # 文件上传目录
│   ├── audio/                 # 音频文件存储
│   └── cover/                 # 封面图片存储
└── pom.xml                    # Maven配置
```

## 常见问题

### 1. 数据库连接失败
- 确保MySQL服务已启动
- 检查数据库名称、用户名和密码是否正确
- 确保数据库用户有足够的权限

### 2. 文件上传失败
- 检查文件上传路径是否存在且有写权限
- 确保文件大小不超过配置的最大限制（默认100MB）

## 版本历史
- 0.0.1-SNAPSHOT: 初始版本