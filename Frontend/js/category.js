/**
 * 分类页面核心交互逻辑
 * 功能：1. 类型切换（音频/直播） 2. 种类分类联动 3. 时间/热度排序
 */
document.addEventListener('DOMContentLoaded', function() {
    // -------------------------- 1. 元素获取 --------------------------
    // 类型选项（音频/直播）
    const typeOptions = document.querySelectorAll('#typeOptions .filter-option');
    // （已移除种类筛选）
    // 排序选项（时间/热度）
    const sortOptions = document.querySelectorAll('#sortOptions .filter-option');
    // 节目列表容器（用于排序后重新渲染）
    const channelsGrid = document.querySelector('.channels-grid');
    // 原始节目数据：初始为空，从后端接口加载；保留少量回退示例以便本地调试
    let originalChannelData = [];
    const fallbackChannelData = [
        {
            id: 1,
            title: "商务英语会话技巧",
            teacher: "李老师",
            playCount: 25000,
            duration: "45:30",
            publishTime: 1717248000000,
            updatedAt: 1717248000000,
            type: "audio",
            category: "演讲"
        }
    ];

    // 格式化时长（秒 -> mm:ss 或 hh:mm:ss）
    function formatDuration(seconds) {
        if (!seconds) return '';
        seconds = Number(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const pad = n => String(n).padStart(2, '0');
        if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
        return `${m}:${pad(s)}`;
    }

    // 从后端获取节目并映射为页面使用结构
    function fetchPrograms() {
        const url = 'http://localhost:8080/programs';
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(payload => {
                const list = (payload && payload.data) || [];
                // 映射后端 program -> 页面 channel 结构
                originalChannelData = list.map(program => {
                    const firstAudio = (program.audios && program.audios[0]) || {};
                    const durationSeconds = firstAudio.duration || 0;
                    return {
                        id: program.programId || program.id || 0,
                        title: program.title || firstAudio.title || '未命名节目',
                        teacher: '作者' + (program.creatorId ? ' ' + program.creatorId : ''),
                        playCount: program.playCount || firstAudio.playCount || 0,
                        duration: formatDuration(durationSeconds),
                        publishTime: program.createdAt ? new Date(program.createdAt).getTime() : (firstAudio.createdAt ? new Date(firstAudio.createdAt).getTime() : Date.now()),
                        updatedAt: program.updatedAt ? new Date(program.updatedAt).getTime() : (firstAudio.updatedAt ? new Date(firstAudio.updatedAt).getTime() : null),
                        type: 'audio',
                        category: (program.tags && program.tags[0] && program.tags[0].name) || '未分类'
                    };
                });
                // 如果没有返回数据，使用回退数据
                if (originalChannelData.length === 0) originalChannelData = fallbackChannelData;
                return originalChannelData;
            })
            .catch(err => {
                console.error('Failed to fetch programs:', err);
                originalChannelData = fallbackChannelData;
                return originalChannelData;
            });
    }

    // -------------------------- 2. 初始化函数 --------------------------
    function init() {
        // 先从后端加载节目，再渲染与绑定事件
        fetchPrograms().then(() => {
            renderChannelList(originalChannelData);
            bindTypeSwitchEvent();
            bindSortEvent();
        });
    }

    // -------------------------- 分页控制 --------------------------
    const pageSize = 6; // 每页节目数
    let currentPage = 1;

    function renderPagination(data) {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        const total = data.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));

        // 构建分页按钮 HTML
        let html = '';
        html += `<button class="page-btn prev-btn" ${currentPage===1?"disabled":""}>上一页</button>`;

        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i===currentPage? 'active':''}" data-page="${i}">${i}</button>`;
        }

        html += `<button class="page-btn next-btn" ${currentPage===totalPages?"disabled":""}>下一页</button>`;

        pagination.innerHTML = html;

        // 绑定事件
        pagination.querySelectorAll('.page-btn').forEach(btn => {
            if (btn.classList.contains('prev-btn')) {
                btn.addEventListener('click', () => {
                    if (currentPage > 1) { currentPage--; renderChannelList(data); }
                });
            } else if (btn.classList.contains('next-btn')) {
                btn.addEventListener('click', () => {
                    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
                    if (currentPage < totalPages) { currentPage++; renderChannelList(data); }
                });
            } else {
                const p = Number(btn.getAttribute('data-page'));
                btn.addEventListener('click', () => {
                    if (p !== currentPage) {
                        currentPage = p;
                        renderChannelList(data);
                    }
                });
            }
        });
    }

    // -------------------------- 3. 类型切换逻辑（音频/直播） --------------------------
    function bindTypeSwitchEvent() {
        typeOptions.forEach(button => {
            button.addEventListener('click', function() {
                // 更新类型按钮激活状态
                typeOptions.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // 获取当前选中类型（audio/live）
                const currentType = this.getAttribute('data-type');

                // 筛选对应类型的节目并渲染（不再有种类子筛选）
                const filteredData = originalChannelData.filter(channel => channel.type === currentType);
                currentPage = 1;
                renderChannelList(filteredData);
            });
        });
    }

    // -------------------------- 4. 排序逻辑（时间/热度） --------------------------
    function bindSortEvent() {
        sortOptions.forEach(button => {
            button.addEventListener('click', function() {
                // 更新排序按钮激活状态
                sortOptions.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // 获取当前排序类型（time/popularity）
                const sortType = this.getAttribute('data-sort') || 'popularity';
                // 获取当前选中的类型（音频/直播）
                const currentType = document.querySelector('#typeOptions .filter-option.active').getAttribute('data-type');
                // 筛选当前类型的节目
                let filteredData = originalChannelData.filter(channel => channel.type === currentType);

                // 执行排序：time -> 按 updatedAt（新在前）；popularity -> 按 playCount（高在前）
                if (sortType === 'time') {
                    filteredData.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
                } else {
                    filteredData.sort((a, b) => b.playCount - a.playCount);
                }
                currentPage = 1;
                renderChannelList(filteredData);

                // 重新渲染节目列表
                renderChannelList(filteredData);
            });
        });
    }

    // -------------------------- 5. 种类筛选逻辑（可选） --------------------------
    // 已移除种类筛选逻辑（后端数据无 category 字段）

    // -------------------------- 6. 节目列表渲染函数 --------------------------
    function renderChannelList(channelData) {
        // 清空现有列表
        channelsGrid.innerHTML = '';

        // 计算分页并切片显示
        const total = channelData.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;
        const startIndex = (currentPage - 1) * pageSize;
        const pageItems = channelData.slice(startIndex, startIndex + pageSize);

        // 无数据时显示提示
        if (channelData.length === 0) {
            channelsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 0; color: #666;">
                    暂无相关节目，敬请期待～
                </div>
            `;
            return;
        }

        // 遍历当前页数据渲染节目卡片
        pageItems.forEach(channel => {
            // 格式化播放量（万次）
            const formatPlayCount = (count) => {
                return count >= 10000 ? (count / 10000).toFixed(1) + '万' : count;
            };

            // （已移除时间显示）

            // 创建节目卡片元素（匹配现有CSS样式）
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.setAttribute('data-type', channel.type); // 添加type属性
            channelCard.setAttribute('data-course-id', channel.id);
            channelCard.setAttribute('data-category', channel.category);

            channelCard.innerHTML = `
                <div class="channel-thumbnail">
                    <!-- 缩略图背景（实际项目替换为真实图片URL） -->
                    <div style="width: 100%; height: 100%; background: #FFF8DC; display: flex; align-items: center; justify-content: center; color: #FF8C00;">
                        ${channel.type === 'audio' ? '🎧' : '📺'}
                    </div>
                    <div class="thumbnail-overlay">
                        <div class="play-icon">▶</div>
                    </div>
                    <div class="video-duration">${channel.duration || '直播中'}</div>
                </div>
                <div class="channel-info">
                    <h3 class="channel-title">${channel.title}</h3>
                    <div class="channel-meta">
                        <span class="views-count">${formatPlayCount(channel.playCount)}次${channel.type === 'audio' ? '学习' : '观看'}</span>
                    </div>
                    <div class="teacher-info">
                        <div class="teacher-avatar">${channel.teacher.charAt(0)}</div>
                        <span class="teacher-name">${channel.teacher}</span>
                    </div>
                </div>
            `;

            // 卡片点击跳转，根据类型跳转到不同页面
            channelCard.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const id = this.getAttribute('data-course-id');

                if (type === 'audio') {
                    // 音频类型跳转到program_list.html
                    window.location.href = `program_list.html?id=${id}`;
                } else if (type === 'live') {
                    // 直播类型跳转到live.html
                    window.location.href = `live.html?id=${id}&title=${encodeURIComponent(channel.title)}&teacher=${encodeURIComponent(channel.teacher)}`;
                }
            });

            // 添加卡片到列表
            channelsGrid.appendChild(channelCard);
        });

        // 渲染分页控件
        renderPagination(channelData);
    }

    // -------------------------- 7. 启动初始化 --------------------------
    init();
});