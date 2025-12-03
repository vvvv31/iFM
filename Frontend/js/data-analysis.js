/**
 * 数据分析和收益管理页面专属脚本
 * 负责数据渲染、图表展示等功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 模拟后端返回的创作者数据
    const creatorData = {
        totalListens: 4502, // 总收听量
        totalFans: 1256,    // 粉丝数
        totalRevenue: 15280.56, // 累计收益（元）
        activeChannels: 3,  // 活跃频道数
        listenTrend: [80, 120, 60, 150, 90, 180, 110], // 近7天收听趋势
        revenueDetails: [
            { date: '2024-05-01', channel: '英语听力频道', listens: 320, revenue: 128.50 },
            { date: '2024-05-02', channel: '日常口语300句', listens: 450, revenue: 182.30 },
            { date: '2024-05-03', channel: '商务英语进阶', listens: 280, revenue: 113.70 },
            { date: '2024-05-04', channel: '英语听力频道', listens: 520, revenue: 209.10 },
            { date: '2024-05-05', channel: '日常口语300句', listens: 380, revenue: 153.20 }
        ]
    };

    // 渲染数据概览
    function renderOverviewData() {
        document.getElementById('total-listens').textContent = creatorData.totalListens.toLocaleString();
        document.getElementById('total-fans').textContent = creatorData.totalFans.toLocaleString();
        document.getElementById('total-revenue').textContent = creatorData.totalRevenue.toFixed(2);
        document.getElementById('active-channels').textContent = creatorData.activeChannels;
    }

    // 渲染收益明细
    function renderRevenueDetails() {
        const revenueTable = document.getElementById('revenue-details');
        if (creatorData.revenueDetails.length === 0) return;

        // 清空默认内容
        revenueTable.innerHTML = '';

        // 渲染每条收益记录
        creatorData.revenueDetails.forEach(item => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #FFDAB9';
            tr.innerHTML = `
                <td style="padding: 10px; font-size: 14px; color: #333;">${item.date}</td>
                <td style="padding: 10px; text-align: center; font-size: 14px; color: #333;">${item.channel}</td>
                <td style="padding: 10px; text-align: center; font-size: 14px; color: #333;">${item.listens}</td>
                <td style="padding: 10px; text-align: right; font-size: 14px; color: #FF8C00; font-weight: 500;">${item.revenue.toFixed(2)}</td>
            `;
            revenueTable.appendChild(tr);
        });
    }

    // 初始化页面数据
    function initDataAnalysisPage() {
        renderOverviewData();
        renderRevenueDetails();
        // 可扩展：引入Chart.js实现更专业的图表，此处为基础占位
    }

    // 页面加载完成后初始化
    initDataAnalysisPage();
});