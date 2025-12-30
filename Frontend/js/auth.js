/**
 * 权限控制模块
 * 处理游客模式和登录模式的区分
 */

// 检查用户是否已登录
function isLoggedIn() {
    const token = localStorage.getItem('authToken');
    return !!token;
}

// 获取当前用户信息
function getCurrentUser() {
    const userRaw = sessionStorage.getItem('userProfile') || localStorage.getItem('userInfo');
    if (!userRaw) return null;
    
    try {
        return JSON.parse(userRaw);
    } catch (e) {
        console.error('解析用户信息失败:', e);
        return null;
    }
}

// 检查权限，如果未登录则重定向到登录页
function requireAuth(redirectToLogin = true) {
    if (!isLoggedIn()) {
        if (redirectToLogin) {
            // 保存当前页面URL，登录后可以跳转回来
            const currentUrl = window.location.href;
            localStorage.setItem('redirectAfterLogin', currentUrl);
            
            // 显示提示消息
            showLoginPrompt();
            
            // 延迟跳转到登录页
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
        return false;
    }
    return true;
}

// 显示登录提示
function showLoginPrompt() {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'login-prompt-toast';
    toast.innerHTML = `
        <div class="login-prompt-content">
            <i class="fas fa-user-lock"></i>
            <span>请先登录后再访问该功能</span>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .login-prompt-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #FF8C00;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 100000;
            opacity: 0;
            animation: slideDown 0.3s ease forwards;
        }
        
        .login-prompt-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .login-prompt-content i {
            font-size: 16px;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    // 3秒后移除提示
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 3000);
}

// 受保护的路由 - 需要登录才能访问
const protectedRoutes = {
    'my-recent': 'my-recent.html',
    'my-collect': 'my-collect.html',
    'my-message': 'my-message.html',
    'my-creator': 'my-creator_center.html'
};

// 带权限检查的跳转函数
function navigateToProtected(pathKey) {
    if (!requireAuth()) {
        return false; // 未登录，停止跳转
    }
    
    const targetPath = protectedRoutes[pathKey];
    if (targetPath) {
        navigateTo(targetPath);
        return true;
    } else {
        console.warn(`未配置的受保护路由：${pathKey}`);
        return false;
    }
}

// 初始化权限控制
function initAuthControl() {
    // 为受保护的导航链接添加权限检查
    document.addEventListener('click', (e) => {
        const targetEl = e.target.closest('[data-page]');
        if (!targetEl) return;
        
        const pageKey = targetEl.getAttribute('data-page');
        const pageName = pageKey.replace('.html', '');
        
        // 检查是否为受保护的路由
        if (protectedRoutes[pageName] && !isLoggedIn()) {
            e.preventDefault();
            e.stopPropagation();
            
            // 显示登录提示并跳转
            requireAuth(true);
            return false;
        }
    });
}

// 页面加载时初始化权限控制
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthControl);
} else {
    initAuthControl();
}

// 导出给全局使用
window.AuthControl = {
    isLoggedIn,
    getCurrentUser,
    requireAuth,
    navigateToProtected,
    protectedRoutes
};