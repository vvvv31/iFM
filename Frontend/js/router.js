/**
 * 全站统一路由配置文件
 * 负责所有页面的跳转逻辑，支持新增页面扩展
 */
const routes = {
    'home': 'index.html',
    'category': 'category.html',
    'channel': 'channel.html',
    'channel2': 'channel2.html',
    'login': 'login.html',
    'my-recent': 'my-recent.html',
    'my-collect': 'my-collect.html',
    'my-subscribe': 'my-subscribe.html',
    'my-message': 'my-message.html',
    'my-creator': 'my-creator_center.html',
    'group-management': 'group-management.html',
    'live': 'live.html',
    'live-streaming': 'live-streaming.html',
    'player': 'player.html',
    'search': 'search.html',
    'data-analysis': 'data-analysis.html'
};

function navigateTo(path) {
    if (!path) {
        console.warn('跳转路径不能为空');
        return;
    }
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
        window.location.href = path;
    }, 200);
}

// 优化路由监听：使用事件委托，兼容动态元素和所有标签类型
function initRouter() {
    // 事件委托：监听整个文档的点击事件，而非单个元素
    document.addEventListener('click', (e) => {
        // 找到包含data-href属性的父级元素（兼容按钮内部嵌套标签的情况）
        const targetEl = e.target.closest('[data-href]');
        if (!targetEl) return;

        // 阻止默认行为（同时兼容a标签和button标签）
        e.preventDefault();
        const targetKey = targetEl.getAttribute('data-href');
        const targetPath = routes[targetKey];

        if (targetPath) {
            navigateTo(targetPath);
        } else {
            console.warn(`未配置路由：${targetKey}，请在routes中添加映射`);
        }
    });

    // 登录/注册表单切换逻辑（保持不变）
    const toRegisterLink = document.querySelector('.to-register');
    const toLoginLink = document.querySelector('.to-login');
    if (toRegisterLink) {
        toRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('切换到注册表单（可在此处添加表单切换逻辑）');
        });
    }
    if (toLoginLink) {
        toLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('切换到登录表单（可在此处添加表单切换逻辑）');
        });
    }
}

// 页面加载初始化（保持不变）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRouter);
} else {
    initRouter();
}