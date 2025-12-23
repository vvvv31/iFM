/**
 * 分类页面核心交互逻辑 - 联调版本
 */
document.addEventListener('DOMContentLoaded', function() {
    // -------------------------- 1. 元素获取 --------------------------
    const typeOptions = document.querySelectorAll('#typeOptions .filter-option');
    const audioCategories = document.getElementById('audioCategories');
    const liveCategories = document.getElementById('liveCategories');
    const sortOptions = document.querySelectorAll('#sortOptions .filter-option');
    const channelsGrid = document.querySelector('.channels-grid');

    // 当前状态
    let currentType = 'audio';
    let currentCategory = '全部';
    let currentSort = 'time';

    // -------------------------- 2. 初始化函数 --------------------------
    async function init() {
        // 加载分类数据
        await loadCategories();
        // 加载节目列表
        await loadPrograms();
        // 绑定事件
        bindEvents();
    }

    // 加载分类数据
    async function loadCategories() {
        try {
            const response = await fetch('http://localhost:8080/api/content/category/list');
            if (!response.ok) {
                throw new Error('分类加载失败');
            }
            const result = await response.json();
            const categories = result.data || [];

            // 渲染分类
            renderCategories(categories);
        } catch (error) {
            console.error('加载分类失败:', error);
            // 降级处理：使用默认分类
            const defaultCategories = ['演讲', '有声书', '音乐', '直播讲座', '答疑直播'];
            renderCategories(defaultCategories.map((name, index) => ({ id: index + 1, name })));
        }
    }

    // 渲染分类
    function renderCategories(categories) {
        // 清空现有分类
        audioCategories.innerHTML = '';
        liveCategories.innerHTML = '';

        // 添加"全部"选项
        const allAudioBtn = createCategoryButton('全部', 'audio');
        audioCategories.appendChild(allAudioBtn);

        const allLiveBtn = createCategoryButton('全部', 'live');
        liveCategories.appendChild(allLiveBtn);

        // 添加分类按钮
        categories.forEach(category => {
            const audioBtn = createCategoryButton(category.name, 'audio');
            audioCategories.appendChild(audioBtn);

            const liveBtn = createCategoryButton(category.name, 'live');
            liveCategories.appendChild(liveBtn);
        });
    }

    // 创建分类按钮
    function createCategoryButton(name, type) {
        const button = document.createElement('button');
        button.className = 'filter-option';
        if (name === '全部') {
            button.classList.add('active');
        }
        button.textContent = name;
        button.dataset.category = name;
        button.dataset.type = type;

        button.addEventListener('click', function() {
            // 更新当前分类
            currentCategory = name;

            // 更新按钮状态
            const container = type === 'audio' ? audioCategories : liveCategories;
            container.querySelectorAll('.filter-option').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // 重新加载节目
            loadPrograms();
        });

        return button;
    }

    // 加载节目列表
    async function loadPrograms() {
        try {
            // 构建请求参数
            const params = new URLSearchParams();
            if (currentCategory !== '全部') {
                params.append('category', currentCategory);
            }
            params.append('type', currentType);
            params.append('sort', currentSort);

            const response = await fetch(`http://localhost:8080/api/content/program/list?${params.toString()}`);

            if (!response.ok) {
                throw new Error('节目加载失败');
            }

            const result = await response.json();
            const programs = result.data || [];

            // 渲染节目列表
            renderProgramList(programs);

        } catch (error) {
            console.error('加载节目失败:', error);
            // 降级处理：显示错误信息
            channelsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 0; color: #666;">
                    加载失败，请刷新重试
                </div>
            `;
        }
    }

    // 渲染节目列表
    function renderProgramList(programs) {
        channelsGrid.innerHTML = '';

        if (programs.length === 0) {
            channelsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 0; color: #666;">
                    暂无相关节目，敬请期待～
                </div>
            `;
            return;
        }

        programs.forEach(program => {
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.dataset.type = program.type || 'audio';
            channelCard.dataset.courseId = program.id;

            channelCard.innerHTML = `
                <div class="channel-thumbnail">
                    <div style="width: 100%; height: 100%; background: #FFF8DC; display: flex; align-items: center; justify-content: center; color: #FF8C00;">
                        ${program.type === 'live' ? '📺' : '🎧'}
                    </div>
                    <div class="thumbnail-overlay">
                        <div class="play-icon">▶</div>
                    </div>
                    <div class="video-duration">${program.duration || '00:00'}</div>
                </div>
                <div class="channel-info">
                    <h3 class="channel-title">${program.title || '未命名节目'}</h3>
                    <div class="channel-meta">
                        <span class="views-count">${formatViewCount(program.views || 0)}次${program.type === 'live' ? '观看' : '学习'}</span>
                        <span class="rating">${formatDate(program.createTime || Date.now())}</span>
                    </div>
                    <div class="teacher-info">
                        <div class="teacher-avatar">${program.teacher ? program.teacher.charAt(0) : '教'}</div>
                        <span class="teacher-name">${program.teacher || '未知老师'}</span>
                    </div>
                </div>
            `;

            // 点击事件
            channelCard.addEventListener('click', function() {
                const type = this.dataset.type;
                const id = this.dataset.courseId;

                if (type === 'audio') {
                    window.location.href = `program_list.html?id=${id}`;
                } else if (type === 'live') {
                    window.location.href = `live.html?id=${id}&title=${encodeURIComponent(program.title)}&teacher=${encodeURIComponent(program.teacher)}`;
                }
            });

            channelsGrid.appendChild(channelCard);
        });
    }

    // 格式化播放量
    function formatViewCount(count) {
        return count >= 10000 ? (count / 10000).toFixed(1) + '万' : count;
    }

    // 格式化日期
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    // -------------------------- 3. 类型切换逻辑 --------------------------
    function bindTypeSwitchEvent() {
        typeOptions.forEach(button => {
            button.addEventListener('click', function() {
                typeOptions.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                currentType = this.getAttribute('data-type');

                // 切换种类容器显示
                if (currentType === 'audio') {
                    audioCategories.style.display = 'flex';
                    liveCategories.style.display = 'none';
                } else if (currentType === 'live') {
                    audioCategories.style.display = 'none';
                    liveCategories.style.display = 'flex';
                }

                // 重置分类选择
                const container = currentType === 'audio' ? audioCategories : liveCategories;
                container.querySelectorAll('.filter-option').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.textContent === '全部') {
                        btn.classList.add('active');
                        currentCategory = '全部';
                    }
                });

                loadPrograms();
            });
        });
    }

    // -------------------------- 4. 排序逻辑 --------------------------
    function bindSortEvent() {
        sortOptions.forEach(button => {
            button.addEventListener('click', function() {
                sortOptions.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                currentSort = this.getAttribute('data-sort');
                loadPrograms();
            });
        });
    }

    // -------------------------- 5. 绑定所有事件 --------------------------
    function bindEvents() {
        bindTypeSwitchEvent();
        bindSortEvent();
    }

    // -------------------------- 6. 启动初始化 --------------------------
    init();
});