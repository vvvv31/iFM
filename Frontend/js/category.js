/**
 * 分类页面核心交互逻辑
 * 功能：1. 类型切换（音频/直播） 2. 种类分类联动 3. 时间/热度排序
 */
document.addEventListener('DOMContentLoaded', function() {
    // -------------------------- 1. 元素获取 --------------------------
    // 类型选项（音频/直播）
    const typeOptions = document.querySelectorAll('#typeOptions .filter-option');
    // 种类容器（音频专属/直播专属）
    const audioCategories = document.getElementById('audioCategories');
    const liveCategories = document.getElementById('liveCategories');
    // 排序选项（时间/热度）
    const sortOptions = document.querySelectorAll('#sortOptions .filter-option');
    // 节目列表容器（用于排序后重新渲染）
    const channelsGrid = document.querySelector('.channels-grid');
    // 原始节目数据（请根据实际项目接口返回数据替换，这里是示例数据）
    const originalChannelData = [
        {
            id: 1,
            title: "商务英语会话技巧",
            teacher: "李老师",
            playCount: 25000,
            duration: "45:30",
            publishTime: 1717248000000, // 2024-06-01 00:00:00（时间戳，毫秒）
            type: "audio", // 类型：audio=音频，live=直播
            category: "演讲" // 所属种类
        },
        {
            id: 2,
            title: "日常英语口语600句",
            teacher: "王老师",
            playCount: 50000,
            duration: "30:15",
            publishTime: 1718248000000, // 2024-06-12 00:00:00
            type: "audio",
            category: "有声书"
        },
        {
            id: 3,
            title: "英语听力进阶训练",
            teacher: "张老师",
            playCount: 14000,
            duration: "52:20",
            publishTime: 1719248000000, // 2024-06-23 00:00:00
            type: "audio",
            category: "音乐"
        },
        {
            id: 4,
            title: "职场英语答疑直播",
            teacher: "刘老师",
            playCount: 8000,
            duration: "90:00",
            publishTime: 1720248000000, // 2024-07-04 00:00:00
            type: "live",
            category: "答疑直播"
        },
        {
            id: 5,
            title: "英语文学专题讲座",
            teacher: "陈老师",
            playCount: 12000,
            publishTime: 1721248000000, // 2024-07-15 00:00:00
            type: "live",
            category: "直播讲座"
        }
    ];

    // -------------------------- 2. 初始化函数 --------------------------
    function init() {
        // 初始化显示音频种类+时间排序
        renderChannelList(originalChannelData);
        // 绑定类型切换事件
        bindTypeSwitchEvent();
        // 绑定排序切换事件
        bindSortEvent();
        // 绑定种类选择事件（可选：如需单独筛选种类）
        bindCategorySelectEvent();
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

                // 切换种类容器显示/隐藏
                if (currentType === 'audio') {
                    audioCategories.style.display = 'flex';
                    liveCategories.style.display = 'none';
                } else if (currentType === 'live') {
                    audioCategories.style.display = 'none';
                    liveCategories.style.display = 'flex';
                }

                // 筛选对应类型的节目并渲染
                const filteredData = originalChannelData.filter(channel =>
                    channel.type === currentType
                );
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
                const sortType = this.getAttribute('data-sort');
                // 获取当前选中的类型（音频/直播）
                const currentType = document.querySelector('#typeOptions .filter-option.active').getAttribute('data-type');
                // 筛选当前类型的节目
                let filteredData = originalChannelData.filter(channel =>
                    channel.type === currentType
                );

                // 执行排序
                if (sortType === 'time') {
                    // 按发布时间降序（最新在前）
                    filteredData.sort((a, b) => b.publishTime - a.publishTime);
                } else if (sortType === 'popularity') {
                    // 按播放量降序（热度在前）
                    filteredData.sort((a, b) => b.playCount - a.playCount);
                }

                // 重新渲染节目列表
                renderChannelList(filteredData);
            });
        });
    }

    // -------------------------- 5. 种类筛选逻辑（可选） --------------------------
    function bindCategorySelectEvent() {
        // 音频种类筛选
        const audioCategoryBtns = audioCategories.querySelectorAll('.filter-option');
        audioCategoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                audioCategoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const selectedCategory = this.textContent;
                const filteredData = originalChannelData.filter(channel =>
                    channel.type === 'audio' && channel.category === selectedCategory
                );
                renderChannelList(filteredData);
            });
        });

        // 直播种类筛选
        const liveCategoryBtns = liveCategories.querySelectorAll('.filter-option');
        liveCategoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                liveCategoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const selectedCategory = this.textContent;
                const filteredData = originalChannelData.filter(channel =>
                    channel.type === 'live' && channel.category === selectedCategory
                );
                renderChannelList(filteredData);
            });
        });
    }

    // -------------------------- 6. 节目列表渲染函数 --------------------------
    function renderChannelList(channelData) {
        // 清空现有列表
        channelsGrid.innerHTML = '';

        // 无数据时显示提示
        if (channelData.length === 0) {
            channelsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 0; color: #666;">
                    暂无相关节目，敬请期待～
                </div>
            `;
            return;
        }

        // 遍历数据渲染节目卡片
        channelData.forEach(channel => {
            // 格式化播放量（万次）
            const formatPlayCount = (count) => {
                return count >= 10000 ? (count / 10000).toFixed(1) + '万' : count;
            };

            // 格式化时间戳为日期（YYYY-MM-DD）
            const formatDate = (timestamp) => {
                const date = new Date(timestamp);
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            };

            // 创建节目卡片元素（匹配现有CSS样式）
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.innerHTML = `
                <div class="channel-thumbnail">
                    <!-- 缩略图背景（实际项目替换为真实图片URL） -->
                    <div style="width: 100%; height: 100%; background: #FFF8DC; display: flex; align-items: center; justify-content: center; color: #FF8C00;">
                        ${channel.type === 'audio' ? '🎧' : '📺'}
                    </div>
                    <div class="thumbnail-overlay">
                        <div class="play-icon">▶</div>
                    </div>
                    <div class="video-duration">${channel.duration}</div>
                </div>
                <div class="channel-info">
                    <h3 class="channel-title">${channel.title}</h3>
                    <div class="channel-meta">
                        <span class="views-count">${formatPlayCount(channel.playCount)}次学习</span>
                        <span class="rating">${formatDate(channel.publishTime)}</span>
                    </div>
                    <div class="teacher-info">
                        <div class="teacher-avatar">${channel.teacher.charAt(0)}</div>
                        <span class="teacher-name">${channel.teacher}</span>
                    </div>
                </div>
            `;

            //卡片点击跳转至详情页，携带节目ID
            channelCard.addEventListener('click', function() {
                // 跳转URL格式：program_list.html?id=节目ID（根据文件实际路径调整）
                window.location.href = `program_list.html?id=${channel.id}`;
            });

            // 添加卡片到列表
            channelsGrid.appendChild(channelCard);
        });
    }

    // -------------------------- 7. 启动初始化 --------------------------
    init();
});