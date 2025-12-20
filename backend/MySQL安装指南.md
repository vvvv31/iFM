# MySQL 8.0 安装详细指南

## 一、下载MySQL安装包

1. 打开浏览器，访问MySQL官方下载页面：
   ```
   https://dev.mysql.com/downloads/mysql/
   ```

2. 在下载页面中：
   - 选择 **MySQL Community Server**
   - 操作系统选择 **Microsoft Windows**
   - 下载类型选择 **MySQL Installer for Windows**
   - 选择最新的稳定版本（通常是GA版本）
   - 点击 **Download** 按钮

3. 在下载页面，选择 **No thanks, just start my download** 跳过登录，直接开始下载

## 二、安装MySQL

1. 下载完成后，双击安装包文件（通常以 `.msi` 结尾）

2. 在安装向导中：
   - 选择 **Developer Default** 安装类型（包含所有必要组件）
   - 点击 **Next** 按钮

3. 在 **Check Requirements** 页面：
   - 点击 **Execute** 按钮安装所需的依赖
   - 安装完成后，点击 **Next** 按钮

4. 在 **Installation** 页面：
   - 点击 **Execute** 按钮开始安装MySQL组件
   - 安装完成后，点击 **Next** 按钮

5. 在 **Product Configuration** 页面：
   - 点击 **Next** 按钮进入配置向导

## 三、配置MySQL

1. 在 **Type and Networking** 页面：
   - 选择 **Server Machine** 作为配置类型
   - 端口保持默认的 `3306`
   - 点击 **Next** 按钮

2. 在 **Authentication Method** 页面：
   - 选择 **Use Legacy Authentication Method (Retain MySQL 5.x Compatibility)**
   - 点击 **Next** 按钮

3. 在 **Accounts and Roles** 页面：
   - 设置MySQL root用户的密码为 `root`（与项目配置一致）
   - 可以选择添加其他用户，也可以跳过
   - 点击 **Next** 按钮

4. 在 **Windows Service** 页面：
   - 保持默认设置（MySQL服务名称为 `MySQL80`，开机自动启动）
   - 点击 **Next** 按钮

5. 在 **Apply Configuration** 页面：
   - 点击 **Execute** 按钮应用所有配置
   - 配置完成后，点击 **Finish** 按钮

6. 在 **Product Configuration** 页面：
   - 点击 **Next** 按钮

7. 在 **Installation Complete** 页面：
   - 点击 **Finish** 按钮完成安装

## 四、验证MySQL安装

1. 按下 `Win + X` 组合键，选择 **Windows PowerShell（管理员）**

2. 执行以下命令启动MySQL服务：
   ```powershell
   net start MySQL80
   ```

3. 执行以下命令连接到MySQL服务器：
   ```powershell
   mysql -u root -p
   ```

4. 输入密码 `root` 并回车

5. 如果成功连接到MySQL服务器，会显示MySQL命令行提示符：
   ```
   mysql>
   ```

6. 输入 `exit` 退出MySQL命令行

## 五、配置环境变量（可选）

为了方便在命令行中使用MySQL命令，可以配置环境变量：

1. 按下 `Win + R` 组合键，输入 `sysdm.cpl` 并回车

2. 在 **系统属性** 窗口中，点击 **高级** 选项卡，然后点击 **环境变量** 按钮

3. 在 **系统变量** 中，找到并选择 `Path` 变量，点击 **编辑** 按钮

4. 点击 **新建** 按钮，添加MySQL的bin目录路径（通常为 `C:\Program Files\MySQL\MySQL Server 8.0\bin`）

5. 点击 **确定** 按钮保存所有更改

6. 关闭并重新打开命令行窗口，验证MySQL命令是否可以直接使用：
   ```powershell
   mysql --version
   ```

---

安装完成后，您可以按照《启动指南.md》中的步骤继续操作，创建数据库并启动IFM-Service应用程序。