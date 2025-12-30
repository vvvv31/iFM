// daily-sentence.js
// 用于首页每日一句的获取与渲染

(function() {
    // API 地址
    const API_URL = 'http://localhost:8080/daily-sentences';

    // 获取每日一句并渲染到页面
    async function fetchAndRenderDailySentence() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            if (data && data.code === 0 && Array.isArray(data.data) && data.data.length > 0) {
                // 随机选一句
                const item = data.data[Math.floor(Math.random() * data.data.length)];
                renderDailySentence(item);
            }
        } catch (e) {
            // 可选：失败时不做处理，保留默认内容
            // console.error('获取每日一句失败', e);
        }
    }

    // 渲染到页面
    function renderDailySentence(item) {
        const quoteContent = document.querySelector('.quote-content');
        if (!quoteContent) return;
        // 英文+作者
        const english = item.english + (item.author ? ' - ' + item.author : '');
        // 中文+作者
        const chinese = item.chinese + (item.author ? ' - ' + item.author : '');
        // 填充
        const span = quoteContent.querySelector('span');
        const pText = quoteContent.querySelector('.quote-text');
        const pCn = quoteContent.querySelectorAll('p')[1];
        if (span) span.textContent = '每日一句';
        if (pText) pText.textContent = english;
        if (pCn) {
            pCn.textContent = chinese;
            pCn.style.marginTop = '8px';
            pCn.style.fontSize = '14px';
            pCn.style.color = '#666';
        }
    }

    // 页面加载后执行
    document.addEventListener('DOMContentLoaded', fetchAndRenderDailySentence);
})();
