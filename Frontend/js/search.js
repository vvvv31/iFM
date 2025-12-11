// search.js - 搜索核心处理函数
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

// 模拟课程数据
const mockCourses = [
    {
        id: 1,
        title: "商务英语会话技巧",
        views: "2.5万次学习",
        rating: "★★★★★",
        duration: "45:30",
        teacher: { avatar: "李", name: "李老师" },
        category: "商务英语",
        type: "audio",
        description: "本课程专为商务人士设计，涵盖商务会议、谈判、邮件写作等实用场景，帮助您提升商务英语沟通能力。"
    },
    {
        id: 2,
        title: "日常英语口语600句",
        views: "5.0万次学习",
        rating: "★★★★★",
        duration: "60:15",
        teacher: { avatar: "王", name: "王老师" },
        category: "日常口语",
        type: "audio",
        description: "精选600个日常口语表达，覆盖生活、工作、旅行等各个方面，让您的英语口语更地道。"
    },
    {
        id: 3,
        title: "英语听力进阶训练",
        views: "1.4万次学习",
        rating: "★★★★★",
        duration: "38:20",
        teacher: { avatar: "张", name: "张老师" },
        category: "听力训练",
        type: "audio",
        description: "通过系统训练，提高英语听力理解能力，帮助您更好地理解英语对话和讲座。"
    },
    {
        id: 4,
        title: "英语写作技巧提升",
        views: "10万次学习",
        rating: "★★★★★",
        duration: "52:10",
        teacher: { avatar: "张", name: "张老师" },
        category: "写作技巧",
        type: "audio",
        description: "从基础到高级，系统学习英语写作技巧，提高写作表达能力。"
    },
    {
        id: 5,
        title: "零基础英语入门",
        views: "8.2万次学习",
        rating: "★★★★★",
        duration: "28:55",
        teacher: { avatar: "刘", name: "刘老师" },
        category: "入门基础",
        type: "audio",
        description: "为零基础学习者设计，从字母发音开始，循序渐进学习英语基础知识。"
    },
    {
        id: 6,
        title: "英语语法精讲",
        views: "4.3万次学习",
        rating: "★★★★★",
        duration: "36:30",
        teacher: { avatar: "赵", name: "赵老师" },
        category: "语法学习",
        type: "live",
        description: "系统讲解英语语法规则，帮助您理解和使用正确的英语语法结构。"
    },
    {
        id: 7,
        title: "旅游英语口语",
        views: "3.7万次学习",
        rating: "★★★★★",
        duration: "41:25",
        teacher: { avatar: "孙", name: "孙老师" },
        category: "旅游英语",
        type: "audio",
        description: "针对旅游场景的实用英语口语，让您出国旅游更加顺畅。"
    },
    {
        id: 8,
        title: "英语发音纠正",
        views: "2.8万次学习",
        rating: "★★★★★",
        duration: "47:40",
        teacher: { avatar: "周", name: "周老师" },
        category: "发音训练",
        type: "audio",
        description: "纠正常见的英语发音问题，提高口语发音准确性和流利度。"
    },
    {
        id: 9,
        title: "英语面试技巧",
        views: "3.2万次学习",
        rating: "★★★★★",
        duration: "39:15",
        teacher: { avatar: "吴", name: "吴老师" },
        category: "面试英语",
        type: "audio",
        description: "学习英语面试中的常见问题和回答技巧，提高面试成功率。"
    },
    {
        id: 10,
        title: "考研英语阅读理解",
        views: "6.5万次学习",
        rating: "★★★★☆",
        duration: "55:20",
        teacher: { avatar: "陈", name: "陈教授" },
        category: "考试英语",
        type: "audio",
        description: "针对考研英语阅读理解的专项训练，提高阅读速度和准确率。"
    },
    {
        id: 11,
        title: "少儿英语启蒙",
        views: "9.8万次学习",
        rating: "★★★★★",
        duration: "25:40",
        teacher: { avatar: "杨", name: "杨老师" },
        category: "少儿英语",
        type: "audio",
        description: "通过歌曲、游戏等方式，激发孩子学习英语的兴趣，打好英语基础。"
    },
    {
        id: 12,
        title: "职场英语沟通",
        views: "4.1万次学习",
        rating: "★★★★★",
        duration: "49:30",
        teacher: { avatar: "郑", name: "郑总监" },
        category: "职场英语",
        type: "live",
        description: "学习职场中的英语沟通技巧，包括会议、报告、邮件等场景。"
    }
];

// 模拟频道数据
const mockChannels = [
    {
        id: 1,
        name: "英语口语频道",
        followers: "15.2万关注",
        courses: "58门课程",
        description: "专注于英语口语训练的频道，提供丰富的口语练习材料"
    },
    {
        id: 2,
        name: "商务英语学习",
        followers: "8.7万关注",
        courses: "32门课程",
        description: "商务人士必备的英语学习频道"
    },
    {
        id: 3,
        name: "英语听力训练营",
        followers: "12.5万关注",
        courses: "45门课程",
        description: "每日更新英语听力材料，提高听力水平"
    },
    {
        id: 4,
        name: "英语写作提升",
        followers: "6.3万关注",
        courses: "28门课程",
        description: "从基础写作到高级表达的系统训练"
    }
];

// 搜索页面课程ID -> 课程详情页面课程ID
const courseIdMap = {
    1: '1',   // 商务英语会话技巧
    2: '2',   // 日常英语口语600句
    3: '3',   // 英语听力进阶训练
    4: '6',   // 英语写作技巧提升 -> program_list.html 中的 id=6
    5: '7',   // 零基础英语入门 -> program_list.html 中的 id=7
    6: '8',   // 英语语法精讲 -> program_list.html 中的 id=8
    7: '9',   // 旅游英语口语 -> program_list.html 中的 id=9
    8: '10',  // 英语发音纠正 -> program_list.html 中的 id=10
    9: '11',  // 英语面试技巧 -> program_list.html 中的 id=11
    10: '12', // 考研英语阅读理解 -> program_list.html 中的 id=12
    11: '13', // 少儿英语启蒙 -> program_list.html 中的 id=13
    12: '14'  // 职场英语沟通 -> program_list.html 中的 id=14
};

// 根据分类获取颜色
function getColorByCategory(category) {
    const colors = {
        '商务英语': 'linear-gradient(135deg, #FFE4B5, #FFD700)',
        '日常口语': 'linear-gradient(135deg, #B0E0E6, #87CEEB)',
        '听力训练': 'linear-gradient(135deg, #D8BFD8, #DA70D6)',
        '写作技巧': 'linear-gradient(135deg, #98FB98, #90EE90)',
        '入门基础': 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
        '语法学习': 'linear-gradient(135deg, #DDA0DD, #BA55D3)',
        '旅游英语': 'linear-gradient(135deg, #F0E68C, #FFD700)',
        '发音训练': 'linear-gradient(135deg, #87CEEB, #4682B4)',
        '面试英语': 'linear-gradient(135deg, #E6E6FA, #9370DB)',
        '考试英语': 'linear-gradient(135deg, #FFA07A, #FF7F50)',
        '少儿英语': 'linear-gradient(135deg, #FFDAB9, #FFA500)',
        '职场英语': 'linear-gradient(135deg, #AFEEEE, #48D1CC)'
    };
    return colors[category] || 'linear-gradient(135deg, #FFF8DC, #FFDAB9)';
}

// 高亮关键词
function highlightKeyword(text, keyword) {
    if (!keyword || keyword === "热门推荐") return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span style="color: #FF8C00; font-weight: bold;">$1</span>');
}

// 搜索数据并显示结果 - 修复：初始调用应用过滤
function searchDataAndDisplay(keyword) {
    const lowerKeyword = keyword.toLowerCase();

    // 获取当前选中的过滤和排序
    const activeType = document.querySelector('.filter-option[data-type].active')?.getAttribute('data-type') || 'all';
    const activeSort = document.querySelector('.filter-option[data-sort].active')?.getAttribute('data-sort') || 'popularity';

    // 直接调用applyFilters进行搜索和排序
    applyFilters(keyword, activeType, activeSort);
}

// 获取URL中的搜索关键词
function getSearchKeyword() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = decodeURIComponent(urlParams.get('keyword') || '');

    // 如果没有关键词，默认显示热门课程
    if (!keyword) {
        return "热门推荐";
    }

    return keyword;
}

// 绑定过滤事件
function bindFilterEvents() {
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function() {
            const group = this.parentElement;
            const activeBtn = group.querySelector('.filter-option.active');
            if (activeBtn) activeBtn.classList.remove('active');
            this.classList.add('active');

            // 获取过滤和排序参数
            let type = this.getAttribute('data-type');
            let sort = this.getAttribute('data-sort');

            // 如果没有当前参数，获取已激活的
            if (!type) {
                type = document.querySelector('.filter-option[data-type].active')?.getAttribute('data-type') || 'all';
            }
            if (!sort) {
                sort = document.querySelector('.filter-option[data-sort].active')?.getAttribute('data-sort') || 'popularity';
            }

            // 重新搜索并应用过滤
            const keyword = getSearchKeyword();
            applyFilters(keyword, type, sort);
        });
    });
}

// 应用过滤和排序 - 修复：正确过滤和排序
function applyFilters(keyword, type, sort) {
    const lowerKeyword = keyword.toLowerCase();

    // 先按关键词搜索
    let filteredCourses = mockCourses.filter(course => {
        if (keyword === "热门推荐") {
            return true; // 显示所有课程
        }
        return course.title.toLowerCase().includes(lowerKeyword) ||
               course.category.toLowerCase().includes(lowerKeyword) ||
               course.description.toLowerCase().includes(lowerKeyword) ||
               course.teacher.name.toLowerCase().includes(lowerKeyword);
    });

    // 按类型过滤 - 修复：使用正确的type属性
    if (type !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.type === type);
    }

    // 按排序方式排序 - 修复：增加默认排序为热度
    if (sort === 'popularity') {
        filteredCourses.sort((a, b) => {
            // 提取数字部分（如 "2.5万" 转换为 25000）
            const getViewCount = (views) => {
                const match = views.match(/([\d.]+)(万?)次学习/);
                if (!match) return 0;
                const num = parseFloat(match[1]);
                const isWan = match[2] === '万';
                return isWan ? num * 10000 : num;
            };

            const aViews = getViewCount(a.views);
            const bViews = getViewCount(b.views);
            return bViews - aViews; // 降序排列，热度高的在前
        });
    } else if (sort === 'time') {
        // 这里假设id越大越新
        filteredCourses.sort((a, b) => b.id - a.id);
    } else {
        // 相关度排序（默认）：关键词匹配程度
        filteredCourses.sort((a, b) => {
            const aScore = calculateRelevanceScore(a, keyword);
            const bScore = calculateRelevanceScore(b, keyword);
            return bScore - aScore;
        });
    }

    // 更新显示结果
    updateSearchResults(filteredCourses, keyword);
}

// 计算相关度分数
function calculateRelevanceScore(course, keyword) {
    if (keyword === "热门推荐") return 0;

    let score = 0;
    const lowerKeyword = keyword.toLowerCase();

    // 标题匹配分数最高
    if (course.title.toLowerCase().includes(lowerKeyword)) {
        score += 10;
    }

    // 分类匹配分数次之
    if (course.category.toLowerCase().includes(lowerKeyword)) {
        score += 8;
    }

    // 描述匹配分数较低
    if (course.description.toLowerCase().includes(lowerKeyword)) {
        score += 5;
    }

    // 教师匹配分数较低
    if (course.teacher.name.toLowerCase().includes(lowerKeyword)) {
        score += 3;
    }

    // 热度加分
    const getViewCount = (views) => {
        const match = views.match(/([\d.]+)(万?)次学习/);
        if (!match) return 0;
        const num = parseFloat(match[1]);
        const isWan = match[2] === '万';
        return isWan ? num * 10000 : num;
    };

    const views = getViewCount(course.views);
    score += Math.log10(views + 1);

    return score;
}

// 更新搜索结果 - 修复：确保正确显示
function updateSearchResults(courses, keyword) {
    const resultCountEl = document.getElementById('total-results');
    if (resultCountEl) {
        resultCountEl.textContent = courses.length;
    }

    const searchResultsGrid = document.getElementById('search-results-grid');
    if (searchResultsGrid) {
        if (courses.length > 0) {
            const coursesHTML = courses.map(course => `
                <div class="channel-card" data-course-id="${course.id}">
                    <div class="channel-thumbnail">
                        <div class="thumbnail-overlay">
                            <span class="play-icon">▶</span>
                            <span class="video-duration">${course.duration}</span>
                        </div>
                    </div>
                    <div class="channel-info">
                        <h3 class="channel-title">${highlightKeyword(course.title, keyword)}</h3>
                        <div class="channel-meta">
                            <span class="views-count">${course.views}</span>
                            <span class="rating">${course.rating}</span>
                        </div>
                        <div class="teacher-info">
                            <div class="teacher-avatar">${course.teacher.avatar}</div>
                            <span class="teacher-name">${course.teacher.name}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            searchResultsGrid.innerHTML = coursesHTML;

            // 重新绑定点击事件
            document.querySelectorAll('#search-results-grid .channel-card').forEach(card => {
                card.addEventListener('click', function() {
                    const courseId = this.getAttribute('data-course-id');
                    const mappedId = courseIdMap[courseId] || courseId; // 使用映射表获取对应的ID

                    // 直接跳转到课程详情页，传递映射后的ID
                    window.location.href = `program_list.html?id=${mappedId}`;
                });
            });
        } else {
            searchResultsGrid.innerHTML = `
                <div class="no-results-container">
                    <div class="no-results-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="no-results-title">未找到相关课程</h3>
                    <p>尝试使用其他关键词搜索，或浏览我们的分类页面</p>
                    <div class="no-results-suggestions">
                        <a href="category.html">浏览分类</a> |
                        <a href="index.html">返回首页</a>
                    </div>
                </div>
            `;
        }
    }

    // 隐藏分页（如果结果较少）
    const pagination = document.getElementById('search-pagination');
    if (pagination) {
        if (courses.length <= 9) {
            pagination.style.display = 'none';
        } else {
            pagination.style.display = 'flex';
        }
    }
}

// 模拟获取课程章节
function getCourseChapters(courseId) {
    const chaptersData = {
        1: [
            { title: "商务会议英语", duration: "15:30" },
            { title: "商务谈判技巧", duration: "18:20" },
            { title: "商务邮件写作", duration: "11:40" }
        ],
        2: [
            { title: "日常问候与介绍", duration: "20:15" },
            { title: "餐厅点餐用语", duration: "15:30" },
            { title: "购物砍价技巧", duration: "24:30" }
        ],
        3: [
            { title: "听力基础训练", duration: "15:00" },
            { title: "对话听力理解", duration: "12:20" },
            { title: "讲座听力技巧", duration: "10:40" }
        ]
    };

    return chaptersData[courseId] || [
        { title: "第一课", duration: "10:00" },
        { title: "第二课", duration: "12:00" },
        { title: "第三课", duration: "15:00" }
    ];
}

// 绑定分页事件
function bindPaginationEvents() {
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('active') || this.classList.contains('prev-btn') || this.classList.contains('next-btn')) {
                return;
            }

            const activeBtn = document.querySelector('.page-btn.active');
            if (activeBtn) activeBtn.classList.remove('active');
            this.classList.add('active');

            // 这里可以添加分页加载逻辑
            const page = this.textContent;
            console.log(`加载第 ${page} 页数据`);
            // loadPage(page);
        });
    });
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化搜索功能
    bindSearchEvents();

    // 如果是搜索页面，显示搜索结果
    if (window.location.pathname.includes('search.html')) {
        // 设置默认排序为热度
        const sortBtn = document.querySelector('.filter-option[data-sort="popularity"]');
        if (sortBtn) {
            // 移除其他排序按钮的active类
            document.querySelectorAll('.filter-option[data-sort]').forEach(btn => {
                btn.classList.remove('active');
            });
            // 设置热度按钮为active
            sortBtn.classList.add('active');
        }

        const keyword = getSearchKeyword();
        // 显示关键词
        const keywordEl = document.getElementById('search-keyword');
        if (keywordEl && keyword !== "热门推荐") {
            keywordEl.textContent = keyword;
        }

        // 搜索并显示结果，使用默认过滤和排序
        searchDataAndDisplay(keyword);
        bindFilterEvents();
        bindPaginationEvents();
    }
});