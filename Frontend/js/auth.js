// auth.js - 通用身份验证管理模块

// 定义受限页面列表
const restrictedPages = [
    'my-recent.html',
    'my-collect.html',
    'my-subscribe.html',
    'my-creator_center.html',
    'my-message.html',
    'upload-audio.html',
    'group-management.html',
    'data-analysis.html'
];

// 获取认证令牌
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// 设置认证令牌
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// 移除认证令牌
function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// 检查用户是否已登录
function isAuthenticated() {
    return !!getAuthToken();
}

// 检查页面是否需要登录权限
function isRestrictedPage(pageUrl) {
    // 提取文件名
    const pageName = pageUrl.split('/').pop();
    return restrictedPages.includes(pageName);
}

// 验证当前页面访问权限
function checkPageAccess() {
    const currentUrl = window.location.href;
    
    // 如果是登录/注册页面，允许访问
    if (currentUrl.includes('login.html')) {
        return true;
    }
    
    // 检查是否是受限页面且未登录
    if (isRestrictedPage(currentUrl) && !isAuthenticated()) {
        // 重定向到登录页面
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// 用户登录
function login(token) {
    setAuthToken(token);
    // 可以添加其他登录后的处理逻辑
}

// 用户登出
function logout() {
    removeAuthToken();
    // 重定向到首页或登录页面
    window.location.href = 'index.html';
}

// 初始化身份验证检查
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面访问权限
    checkPageAccess();
    
    // 更新导航栏状态
    updateNavbar();
});

// 更新导航栏以反映登录状态
function updateNavbar() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (isAuthenticated()) {
        // 已登录用户显示完整的导航栏元素
        // 检查是否已经有更新的导航栏结构
        const existingUserFunctions = header.querySelector('.user-functions');
        if (existingUserFunctions) {
            // 移除现有的用户功能元素
            existingUserFunctions.innerHTML = '';
            
            // 添加用户头像
            const userAvatar = document.createElement('a');
            userAvatar.className = 'func-item';
            userAvatar.href = 'my-recent.html';
            userAvatar.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
            
            // 添加消息图标
            const messageIcon = document.createElement('a');
            messageIcon.className = 'func-item';
            messageIcon.href = 'my-message.html';
            messageIcon.innerHTML = '<i class="fas fa-bell"></i> 消息';
            
            // 添加收藏图标
            const collectIcon = document.createElement('a');
            collectIcon.className = 'func-item';
            collectIcon.href = 'my-collect.html';
            collectIcon.innerHTML = '<i class="fas fa-star"></i> 收藏';
            
            // 添加历史图标
            const historyIcon = document.createElement('a');
            historyIcon.className = 'func-item';
            historyIcon.href = 'my-recent.html';
            historyIcon.innerHTML = '<i class="fas fa-history"></i> 历史';
            
            // 添加创作中心图标
            const creatorCenterIcon = document.createElement('a');
            creatorCenterIcon.className = 'func-item';
            creatorCenterIcon.href = 'my-creator_center.html';
            creatorCenterIcon.innerHTML = '<i class="fas fa-pen"></i> 创作中心';
            
            // 添加退出登录按钮
            const logoutBtn = document.createElement('a');
            logoutBtn.className = 'func-item';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> 退出';
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
            
            // 将所有元素添加到用户功能区
            existingUserFunctions.appendChild(userAvatar);
            existingUserFunctions.appendChild(messageIcon);
            existingUserFunctions.appendChild(collectIcon);
            existingUserFunctions.appendChild(historyIcon);
            existingUserFunctions.appendChild(creatorCenterIcon);
            existingUserFunctions.appendChild(logoutBtn);
        }
    } else {
        // 未登录用户的简化导航栏结构
        // 重新创建整个导航栏，确保显示统一的简化样式
        header.innerHTML = `
            <div class="logo">
                <div class="logo-img"></div>
                <span class="logo-text">星之声</span>
            </div>
            <nav class="main-nav">
                <a href="index.html" class="nav-item ${window.location.pathname.includes('index.html') ? 'active' : ''}">首页</a>
                <a href="category.html" class="nav-item ${window.location.pathname.includes('category.html') ? 'active' : ''}">分类</a>
                <a href="channel.html" class="nav-item ${window.location.pathname.includes('channel.html') ? 'active' : ''}">社区</a>
            </nav>
            <div class="search-box">
                <input type="text" placeholder="搜索课程、频道..." class="search-input" id="homeSearchInput">
                <button class="search-btn" id="homeSearchBtn"><i class="fas fa-search"></i></button>
            </div>
            <div class="user-functions">
                <a href="login.html"><button class="submit-btn">登录/注册</button></a>
            </div>
        `;
        
        // 重新绑定搜索事件
        if (typeof initSearch !== 'undefined') {
            initSearch();
        }
    }
}

// 导出函数（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAuthToken,
        setAuthToken,
        removeAuthToken,
        isAuthenticated,
        isRestrictedPage,
        checkPageAccess,
        login,
        logout,
        updateNavbar
    };
}