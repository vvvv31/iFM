// 搜索核心处理函数
function handleSearch() {
    // 获取首页和搜索页的搜索输入框
    const searchInput = document.getElementById('homeSearchInput') ||
                       document.querySelector('.search-box .search-input');
    if (!searchInput) return;

    // 获取并清理搜索关键词
    const keyword = searchInput.value.trim();

    // 非空校验
    if (!keyword) {
        alert('请输入搜索关键词（如英语课程、日常口语等）');
        searchInput.focus();
        return;
    }

    // 从路由配置中获取搜索结果页路径（兼容未配置路由的情况）
    const searchPath = window.routes?.['search'] || 'search.html';
    if (!searchPath) {
        console.warn('未配置搜索结果页路由，请检查 router.js');
        return;
    }

    // 拼接关键词参数（URL编码，兼容特殊字符）
    const targetPath = `${searchPath}?keyword=${encodeURIComponent(keyword)}`;

    // 调用全局跳转函数，保持页面过渡效果一致
    if (typeof navigateTo === 'function') {
        navigateTo(targetPath);
    } else {
        // 降级处理：直接跳转
        window.location.href = targetPath;
    }
}

// 绑定搜索相关事件
function bindSearchEvents() {
    // 获取首页和搜索页的搜索按钮
    const searchBtns = [
        document.getElementById('homeSearchBtn'),
        document.querySelector('.search-box .search-btn')
    ].filter(btn => btn);

    // 绑定搜索按钮点击事件
    searchBtns.forEach(btn => {
        btn.addEventListener('click', handleSearch);
    });

    // 获取所有搜索输入框
    const searchInputs = [
        document.getElementById('homeSearchInput'),
        document.querySelector('.search-box .search-input')
    ].filter(input => input);

    // 绑定搜索框回车键事件
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    });
}

// 页面加载完成后初始化搜索功能
document.addEventListener('DOMContentLoaded', function() {
    // 确保路由配置已加载
    if (window.routes) {
        bindSearchEvents();
    } else {
        // 延迟重试，防止路由脚本加载顺序问题
        setTimeout(bindSearchEvents, 300);
    }
});