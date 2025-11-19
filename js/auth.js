// 用户认证和权限管理模块
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.bindAuthEvents();
    }

    bindAuthEvents() {
        // 登录表单提交
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form') {
                e.preventDefault();
                this.handleLogin(e.target);
            } else if (e.target.id === 'register-form') {
                e.preventDefault();
                this.handleRegister(e.target);
            }
        });

        // 退出登录
        document.addEventListener('click', (e) => {
            if (e.target.closest('.logout-btn')) {
                this.handleLogout();
            }
        });

        // 头像上传
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('avatar-upload')) {
                this.handleAvatarUpload(e.target);
            }
        });

        // 切换登录/注册表单
        document.addEventListener('click', (e) => {
            if (e.target.closest('.switch-auth-form')) {
                this.switchAuthForm(e.target);
            }
        });
    }

    loadUserFromStorage() {
        const savedUser = localStorage.getItem('starryVoiceCurrentUser');
        const savedToken = localStorage.getItem('starryVoiceToken');
        
        if (savedUser && savedToken) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
            this.updateUIForLoggedInUser();
        } else {
            this.showLoginModal();
        }
    }

    showLoginModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideLoginModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const loginType = formData.get('login_type');
        const identifier = formData.get('identifier');
        const password = formData.get('password');
        const verificationCode = formData.get('verification_code');

        // 显示加载状态
        this.showAuthLoading(true);

        try {
            // 模拟API请求延迟
            await new Promise(resolve => setTimeout(resolve, 1500));

            let user = null;

            if (loginType === 'phone') {
                user = await this.loginWithPhone(identifier, verificationCode);
            } else if (loginType === 'email') {
                user = await this.loginWithEmail(identifier, password);
            }

            if (user) {
                this.loginSuccess(user);
            } else {
                throw new Error('登录失败，请检查输入信息');
            }

        } catch (error) {
            this.showAuthError(error.message);
        } finally {
            this.showAuthLoading(false);
        }
    }

    async loginWithPhone(phone, code) {
        // 模拟手机验证码验证
        if (code !== '123456') {
            throw new Error('验证码错误');
        }

        const users = this.getStoredUsers();
        let user = users.find(u => u.phone === phone);

        if (!user) {
            // 新用户自动注册
            user = this.createNewUser({
                phone: phone,
                username: `用户${phone.slice(-4)}`,
                loginType: 'phone'
            });
            users.push(user);
            this.saveUsers(users);
        }

        return user;
    }

    async loginWithEmail(email, password) {
        // 模拟邮箱密码验证
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('邮箱或密码错误');
        }

        return user;
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        const username = formData.get('username');

        // 显示加载状态
        this.showAuthLoading(true);

        try {
            // 验证输入
            if (password !== confirmPassword) {
                throw new Error('两次输入的密码不一致');
            }

            if (password.length < 6) {
                throw new Error('密码长度至少6位');
            }

            // 模拟API请求延迟
            await new Promise(resolve => setTimeout(resolve, 1500));

            const users = this.getStoredUsers();
            
            // 检查邮箱是否已注册
            if (users.find(u => u.email === email)) {
                throw new Error('该邮箱已被注册');
            }

            // 创建新用户
            const newUser = this.createNewUser({
                email: email,
                password: password,
                username: username,
                loginType: 'email'
            });

            users.push(newUser);
            this.saveUsers(users);

            this.loginSuccess(newUser);

        } catch (error) {
            this.showAuthError(error.message);
        } finally {
            this.showAuthLoading(false);
        }
    }

    createNewUser(userData) {
        const timestamp = new Date().toISOString();
        return {
            id: 'user_' + Date.now(),
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            avatar: this.generateDefaultAvatar(userData.username),
            isCreator: false,
            createdAt: timestamp,
            updatedAt: timestamp,
            stats: {
                listeningTime: 0,
                following: 0,
                followers: 0
            },
            preferences: {
                theme: 'light',
                notifications: true
            }
        };
    }

    generateDefaultAvatar(username) {
        // 生成基于用户名的默认头像颜色
        const colors = [
            '#4fc3f7', '#f48fb1', '#81c784', '#ffb74d', 
            '#7986cb', '#4db6ac', '#ba68c8', '#a1887f'
        ];
        const color = colors[username.length % colors.length];
        
        // 创建简单的SVG头像
        const svg = `
            <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" fill="${color}"/>
                <text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-weight="bold">
                    ${username.charAt(0).toUpperCase()}
                </text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    loginSuccess(user) {
        this.currentUser = user;
        this.isLoggedIn = true;

        // 生成模拟token
        const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2);

        // 保存到localStorage
        localStorage.setItem('starryVoiceCurrentUser', JSON.stringify(user));
        localStorage.setItem('starryVoiceToken', token);

        // 更新UI
        this.updateUIForLoggedInUser();
        this.hideLoginModal();

        // 显示欢迎消息
        this.showNotification(`欢迎回来，${user.username}！`);
    }

    handleLogout() {
        // 清除本地存储
        localStorage.removeItem('starryVoiceCurrentUser');
        localStorage.removeItem('starryVoiceToken');

        // 重置状态
        this.currentUser = null;
        this.isLoggedIn = false;

        // 更新UI
        this.updateUIForLoggedOutUser();

        // 显示退出消息
        this.showNotification('已退出登录');

        // 显示登录模态框
        setTimeout(() => {
            this.showLoginModal();
        }, 1000);
    }

    updateUIForLoggedInUser() {
        // 更新导航栏用户信息
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar && this.currentUser.avatar) {
            userAvatar.style.backgroundImage = `url(${this.currentUser.avatar})`;
            userAvatar.style.backgroundSize = 'cover';
            userAvatar.style.backgroundPosition = 'center';
        }

        // 更新个人中心
        this.updateProfilePage();

        // 添加退出登录按钮
        this.addLogoutButton();

        // 更新权限相关UI
        this.updatePermissionBasedUI();
    }

    updateUIForLoggedOutUser() {
        // 重置用户头像
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.style.backgroundImage = '';
            userAvatar.style.background = 'linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-yellow) 100%)';
        }

        // 移除退出登录按钮
        this.removeLogoutButton();

        // 重置权限相关UI
        this.resetPermissionBasedUI();
    }

    addLogoutButton() {
        // 检查是否已存在退出按钮
        if (document.querySelector('.logout-btn')) return;

        const userActions = document.querySelector('.user-actions');
        if (userActions) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-outline logout-btn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> 退出';
            userActions.appendChild(logoutBtn);
        }
    }

    removeLogoutButton() {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.remove();
        }
    }

    updateProfilePage() {
        const profilePage = document.getElementById('profile');
        if (profilePage && profilePage.classList.contains('active')) {
            // 触发重新加载个人中心页面
            if (window.app && window.app.loadProfilePage) {
                window.app.loadProfilePage();
            }
        }
    }

    updatePermissionBasedUI() {
        // 根据用户权限更新UI
        const startLiveBtn = document.querySelector('.start-live-btn');
        if (startLiveBtn) {
            if (this.currentUser.isCreator) {
                startLiveBtn.style.display = 'block';
            } else {
                startLiveBtn.style.display = 'none';
            }
        }

        // 更新评论权限等
        this.updateCommentPermissions();
    }

    resetPermissionBasedUI() {
        // 重置权限相关UI到默认状态
        const startLiveBtn = document.querySelector('.start-live-btn');
        if (startLiveBtn) {
            startLiveBtn.style.display = 'none';
        }
    }

    updateCommentPermissions() {
        // 根据登录状态更新评论权限
        const commentInputs = document.querySelectorAll('.comment-input, .danmaku-input');
        commentInputs.forEach(input => {
            if (this.isLoggedIn) {
                input.placeholder = '写下你的评论...';
                input.disabled = false;
            } else {
                input.placeholder = '请先登录后评论...';
                input.disabled = true;
            }
        });
    }

    async handleAvatarUpload(input) {
        const file = input.files[0];
        if (!file) return;

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            this.showNotification('请选择图片文件');
            return;
        }

        // 检查文件大小 (限制为2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('图片大小不能超过2MB');
            return;
        }

        try {
            // 显示加载状态
            this.showNotification('正在上传头像...');

            // 模拟上传延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 创建图片预览并进行裁剪
            const croppedAvatar = await this.cropAndResizeImage(file, 200, 200);

            // 更新用户头像
            this.currentUser.avatar = croppedAvatar;
            this.currentUser.updatedAt = new Date().toISOString();

            // 保存到本地存储
            localStorage.setItem('starryVoiceCurrentUser', JSON.stringify(this.currentUser));

            // 更新UI
            this.updateUIForLoggedInUser();

            this.showNotification('头像上传成功！');

        } catch (error) {
            console.error('头像上传失败:', error);
            this.showNotification('头像上传失败，请重试');
        }
    }

    cropAndResizeImage(file, width, height) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // 设置canvas尺寸
                    canvas.width = width;
                    canvas.height = height;
                    
                    // 计算裁剪参数（居中裁剪）
                    const scale = Math.max(width / img.width, height / img.height);
                    const scaledWidth = img.width * scale;
                    const scaledHeight = img.height * scale;
                    const x = (width - scaledWidth) / 2;
                    const y = (height - scaledHeight) / 2;
                    
                    // 绘制图片
                    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                    
                    // 转换为base64
                    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(croppedDataUrl);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    switchAuthForm(button) {
        const authModal = document.getElementById('auth-modal');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (!authModal || !loginForm || !registerForm) return;

        const targetForm = button.getAttribute('data-form');
        
        if (targetForm === 'register') {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        } else {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        }
    }

    sendVerificationCode(phone) {
        // 模拟发送验证码
        this.showNotification('验证码已发送至：' + phone);
        console.log('模拟验证码：123456');
        
        // 在实际应用中，这里会调用短信服务API
        return '123456'; // 返回固定验证码用于测试
    }

    showAuthLoading(show) {
        const submitButtons = document.querySelectorAll('#login-form button[type="submit"], #register-form button[type="submit"]');
        submitButtons.forEach(btn => {
            if (show) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
            } else {
                btn.disabled = false;
                const form = btn.closest('form');
                if (form.id === 'login-form') {
                    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 登录';
                } else {
                    btn.innerHTML = '<i class="fas fa-user-plus"></i> 注册';
                }
            }
        });
    }

    showAuthError(message) {
        // 移除旧的错误消息
        const oldError = document.querySelector('.auth-error');
        if (oldError) oldError.remove();

        // 创建新的错误消息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;

        // 添加到当前活动的表单
        const activeForm = document.querySelector('#login-form[style="display: block;"], #register-form[style="display: block;"], #login-form:not([style]), #register-form:not([style])');
        if (activeForm) {
            activeForm.insertBefore(errorDiv, activeForm.firstChild);
            
            // 3秒后自动移除
            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
        }
    }

    getStoredUsers() {
        const stored = localStorage.getItem('starryVoiceUsers');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers(users) {
        localStorage.setItem('starryVoiceUsers', JSON.stringify(users));
    }

    showNotification(message) {
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message);
        } else {
            // 备用通知方法
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-blue);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10000;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    // 权限检查方法
    checkPermission(permission) {
        if (!this.isLoggedIn) return false;

        switch (permission) {
            case 'create_content':
                return this.currentUser.isCreator;
            case 'comment':
                return this.isLoggedIn;
            case 'live_stream':
                return this.currentUser.isCreator;
            default:
                return false;
        }
    }

    // 获取当前用户信息
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查是否登录
    isAuthenticated() {
        return this.isLoggedIn;
    }

    // 申请成为创作者
    async applyForCreator() {
        if (!this.isLoggedIn) {
            this.showNotification('请先登录');
            return false;
        }

        try {
            // 模拟申请流程
            this.showNotification('正在提交创作者申请...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.currentUser.isCreator = true;
            this.currentUser.updatedAt = new Date().toISOString();

            // 更新本地存储
            localStorage.setItem('starryVoiceCurrentUser', JSON.stringify(this.currentUser));

            // 更新用户列表
            const users = this.getStoredUsers();
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                this.saveUsers(users);
            }

            this.updateUIForLoggedInUser();
            this.showNotification('恭喜！您已成为创作者，可以开始直播和上传内容了');

            return true;

        } catch (error) {
            this.showNotification('申请失败，请重试');
            return false;
        }
    }
}

// 初始化认证管理器
let authManager = null;

document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    window.authManager = authManager;
});