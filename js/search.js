// 搜索和推荐功能模块
class SearchManager {
    constructor() {
        this.searchIndex = null;
        this.allContent = [];
        this.currentRecommendations = [];
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.bindSearchEvents();
        this.loadAllContent();
    }

    loadAllContent() {
        // 模拟从API获取所有内容
        this.allContent = [
            // 音频内容
            {
                id: 1,
                title: "深夜星空电台：孤独与陪伴",
                creator: "星空主播小雅",
                type: "audio",
                description: "在这个孤独的夜晚，用声音温暖彼此的心灵，分享关于孤独与陪伴的故事。",
                tags: ["情感", "陪伴", "深夜", "治愈"],
                category: "情感陪伴",
                listeners: 1200,
                comments: 86,
                rating: 4.8,
                duration: 1690,
                isLive: false,
                color: "linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)",
                icon: "fas fa-headphones"
            },
            {
                id: 2,
                title: "文学星空：经典短篇小说赏析",
                creator: "文心老师",
                type: "audio",
                description: "深入解读经典短篇小说，领略文学的魅力与深度。",
                tags: ["文学", "小说", "经典", "赏析"],
                category: "知识学习",
                listeners: 3400,
                comments: 124,
                rating: 4.9,
                duration: 2580,
                isLive: false,
                color: "linear-gradient(135deg, #f48fb1 0%, #d81b60 100%)",
                icon: "fas fa-book-open"
            },
            {
                id: 3,
                title: "英语星空：地道表达每日一句",
                creator: "英语小助手",
                type: "audio",
                description: "每天学习一个地道的英语表达，提升你的英语口语能力。",
                tags: ["英语", "学习", "口语", "每日"],
                category: "语言学习",
                listeners: 5700,
                comments: 203,
                rating: 4.7,
                duration: 720,
                isLive: false,
                color: "linear-gradient(135deg, #81c784 0%, #388e3c 100%)",
                icon: "fas fa-language"
            },
            {
                id: 4,
                title: "科技星空：AI技术前沿",
                creator: "科技达人",
                type: "audio",
                description: "探索人工智能技术的最新发展和应用前景。",
                tags: ["科技", "AI", "人工智能", "前沿"],
                category: "科技资讯",
                listeners: 2300,
                comments: 89,
                rating: 4.6,
                duration: 1800,
                isLive: false,
                color: "linear-gradient(135deg, #ba68c8 0%, #8e24aa 100%)",
                icon: "fas fa-robot"
            },
            {
                id: 8,
                title: "历史星空：古代文明探秘",
                creator: "历史学者",
                type: "audio",
                description: "揭开古代文明的神秘面纱，了解人类历史的发展脉络。",
                tags: ["历史", "文明", "古代", "探秘"],
                category: "历史文化",
                listeners: 1800,
                comments: 67,
                rating: 4.7,
                duration: 2100,
                isLive: false,
                color: "linear-gradient(135deg, #ffb74d 0%, #f57c00 100%)",
                icon: "fas fa-monument"
            },
            {
                id: 9,
                title: "音乐星空：古典音乐欣赏",
                creator: "音乐教授",
                type: "audio",
                description: "欣赏古典音乐的经典作品，感受音乐的艺术魅力。",
                tags: ["音乐", "古典", "欣赏", "艺术"],
                category: "音乐艺术",
                listeners: 2900,
                comments: 145,
                rating: 4.8,
                duration: 2400,
                isLive: false,
                color: "linear-gradient(135deg, #7986cb 0%, #3949ab 100%)",
                icon: "fas fa-music"
            },

            // 直播内容
            {
                id: 5,
                title: "心理星空：如何应对焦虑情绪",
                creator: "心理咨询师李老师",
                type: "live",
                description: "专业心理咨询师教你识别和应对焦虑情绪，找到内心的平静。",
                tags: ["心理", "焦虑", "情绪", "健康", "咨询"],
                category: "心理健康",
                listeners: 756,
                comments: 93,
                rating: 4.8,
                isLive: true,
                color: "linear-gradient(135deg, #7986cb 0%, #3949ab 100%)",
                icon: "fas fa-users"
            },
            {
                id: 6,
                title: "学习星空：高效备考技巧分享",
                creator: "学霸小陈",
                type: "live",
                description: "分享高效的备考方法和学习技巧，帮助你在考试中取得好成绩。",
                tags: ["学习", "备考", "技巧", "教育", "考试"],
                category: "学习教育",
                listeners: 1100,
                comments: 145,
                rating: 4.7,
                isLive: true,
                color: "linear-gradient(135deg, #4db6ac 0%, #00897b 100%)",
                icon: "fas fa-chalkboard-teacher"
            },
            {
                id: 7,
                title: "音乐星空：点歌互动夜",
                creator: "DJ小乐",
                type: "live",
                description: "点播你喜欢的歌曲，与主播和其他听众一起享受音乐之夜。",
                tags: ["音乐", "点歌", "互动", "娱乐", "DJ"],
                category: "音乐娱乐",
                listeners: 892,
                comments: 167,
                rating: 4.8,
                isLive: true,
                color: "linear-gradient(135deg, #ffb74d 0%, #f57c00 100%)",
                icon: "fas fa-music"
            },
            {
                id: 10,
                title: "美食星空：深夜食堂",
                creator: "美食家老王",
                type: "live",
                description: "分享美食制作技巧，聊聊各地的美食文化。",
                tags: ["美食", "烹饪", "食堂", "深夜", "文化"],
                category: "生活美食",
                listeners: 650,
                comments: 78,
                rating: 4.6,
                isLive: true,
                color: "linear-gradient(135deg, #f48fb1 0%, #d81b60 100%)",
                icon: "fas fa-utensils"
            },
            {
                id: 11,
                title: "运动星空：健身指导",
                creator: "健身教练",
                type: "live",
                description: "专业的健身指导，带你科学锻炼，保持健康体魄。",
                tags: ["运动", "健身", "健康", "指导", "锻炼"],
                category: "运动健康",
                listeners: 420,
                comments: 56,
                rating: 4.5,
                isLive: true,
                color: "linear-gradient(135deg, #81c784 0%, #388e3c 100%)",
                icon: "fas fa-running"
            },
            {
                id: 12,
                title: "旅行星空：环球见闻",
                creator: "旅行达人",
                type: "live",
                description: "分享环球旅行的见闻和故事，带你领略世界风光。",
                tags: ["旅行", "环球", "见闻", "风景", "冒险"],
                category: "旅行户外",
                listeners: 780,
                comments: 112,
                rating: 4.7,
                isLive: true,
                color: "linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)",
                icon: "fas fa-globe-americas"
            }
        ];

        // 初始化推荐内容
        this.shuffleRecommendations();
    }

    buildSearchIndex() {
        this.searchIndex = new Map();
        
        // 在实际应用中，这里会从服务器获取数据构建索引
        console.log('搜索索引初始化完成');
    }

    bindSearchEvents() {
        // 搜索输入事件
        const searchInput = document.querySelector('#search-modal input[type="text"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }

        // 搜索按钮事件
        const searchBtn = document.querySelector('#search-modal button');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchInput = document.querySelector('#search-modal input[type="text"]');
                if (searchInput) {
                    this.performSearch(searchInput.value);
                }
            });
        }

        // 换一批按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.refresh-recommendations')) {
                this.shuffleRecommendations();
                this.updateRecommendationsUI();
            }
        });

        // 搜索模态框显示时的事件
        const searchModal = document.getElementById('search-modal');
        if (searchModal) {
            searchModal.addEventListener('click', (e) => {
                if (e.target === searchModal) {
                    this.clearSearch();
                }
            });
        }
    }

    handleSearchInput(query) {
        // 防抖处理
        clearTimeout(this.searchTimeout);
        
        this.searchTimeout = setTimeout(() => {
            if (query.trim().length === 0) {
                this.showSearchSuggestions();
            } else if (query.trim().length >= 2) {
                this.showRealTimeResults(query.trim());
            } else {
                this.hideRealTimeResults();
            }
        }, 300);
    }

    showSearchSuggestions() {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        // 显示热门搜索建议
        const hotSearches = [
            "深夜电台", "心理辅导", "英语学习", 
            "音乐直播", "健身指导", "美食制作"
        ];

        searchResults.innerHTML = `
            <div class="search-suggestions">
                <h4>热门搜索</h4>
                <div class="hot-search-tags">
                    ${hotSearches.map(tag => `
                        <span class="hot-search-tag" data-query="${tag}">${tag}</span>
                    `).join('')}
                </div>
                <h4>搜索历史</h4>
                <div class="search-history">
                    ${this.getSearchHistory().map(item => `
                        <div class="history-item" data-query="${item}">
                            <i class="fas fa-history"></i>
                            <span>${item}</span>
                            <button class="delete-history" data-query="${item}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // 绑定热门搜索点击事件
        searchResults.querySelectorAll('.hot-search-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const query = tag.getAttribute('data-query');
                document.querySelector('#search-modal input[type="text"]').value = query;
                this.performSearch(query);
            });
        });

        // 绑定历史记录点击事件
        searchResults.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-history')) {
                    const query = item.getAttribute('data-query');
                    document.querySelector('#search-modal input[type="text"]').value = query;
                    this.performSearch(query);
                }
            });
        });

        // 绑定删除历史记录事件
        searchResults.querySelectorAll('.delete-history').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const query = btn.getAttribute('data-query');
                this.removeFromSearchHistory(query);
                this.showSearchSuggestions();
            });
        });

        searchResults.style.display = 'block';
    }

    showRealTimeResults(query) {
        const results = this.searchContent(query);
        this.displaySearchResults(results, query, true);
    }

    hideRealTimeResults() {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            this.showSearchSuggestions();
            return;
        }

        // 添加到搜索历史
        this.addToSearchHistory(query);

        const results = this.searchContent(query);
        this.displaySearchResults(results, query, false);

        // 更新搜索词显示
        const searchHeader = document.querySelector('.search-results-header');
        if (searchHeader) {
            searchHeader.innerHTML = `
                <h3>搜索结果</h3>
                <div class="search-query">"${query}"</div>
                <div class="search-stats">找到 ${results.length} 个相关内容</div>
            `;
        }
    }

    searchContent(query) {
        const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
        
        if (searchTerms.length === 0) return [];

        return this.allContent.filter(item => {
            const searchableText = `
                ${item.title} ${item.creator} ${item.description} ${item.tags.join(' ')} ${item.category}
            `.toLowerCase();

            // 匹配所有搜索词
            return searchTerms.every(term => searchableText.includes(term));
        });
    }

    displaySearchResults(results, query, isRealTime = false) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = this.generateNoResultsHTML(query, isRealTime);
        } else {
            searchResults.innerHTML = this.generateResultsHTML(results, query, isRealTime);
        }

        searchResults.style.display = 'block';

        // 绑定结果项点击事件
        this.bindSearchResultEvents();
    }

    generateResultsHTML(results, query, isRealTime) {
        const highlightText = (text) => {
            const terms = query.toLowerCase().split(/\s+/);
            let highlighted = text;
            
            terms.forEach(term => {
                if (term.length > 1) {
                    const regex = new RegExp(`(${term})`, 'gi');
                    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
                }
            });
            
            return highlighted;
        };

        if (isRealTime) {
            return `
                <div class="realtime-results">
                    <h4>实时搜索结果</h4>
                    <div class="realtime-results-list">
                        ${results.slice(0, 5).map(item => `
                            <div class="realtime-result-item" data-id="${item.id}" data-type="${item.type}">
                                <div class="result-icon">
                                    <i class="${item.icon}"></i>
                                </div>
                                <div class="result-content">
                                    <div class="result-title">${highlightText(item.title)}</div>
                                    <div class="result-creator">${highlightText(item.creator)}</div>
                                    <div class="result-stats">
                                        <span><i class="fas fa-headphones"></i> ${this.formatNumber(item.listeners)}</span>
                                        ${item.isLive ? '<span class="live-badge-small"><i class="fas fa-circle"></i> 直播中</span>' : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ${results.length > 5 ? `
                        <div class="view-all-results" onclick="searchManager.performSearch('${query}')">
                            查看全部 ${results.length} 个结果
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            return `
                <div class="search-results-content">
                    <div class="search-results-header">
                        <h3>搜索结果</h3>
                        <div class="search-query">"${query}"</div>
                        <div class="search-stats">找到 ${results.length} 个相关内容</div>
                    </div>
                    
                    <div class="search-filters">
                        <button class="filter-btn active" data-filter="all">全部</button>
                        <button class="filter-btn" data-filter="audio">音频</button>
                        <button class="filter-btn" data-filter="live">直播</button>
                    </div>
                    
                    <div class="search-results-grid">
                        ${results.map(item => `
                            <div class="content-card search-result-card" data-id="${item.id}" data-type="${item.type}">
                                <div class="card-image" style="background: ${item.color};">
                                    <i class="${item.icon}"></i>
                                    ${item.isLive ? '<div class="live-badge"><i class="fas fa-circle"></i> 直播中</div>' : ''}
                                </div>
                                <div class="card-content">
                                    <h3 class="card-title">${highlightText(item.title)}</h3>
                                    <div class="card-creator">
                                        <div class="creator-avatar"></div>
                                        <span>${highlightText(item.creator)}</span>
                                    </div>
                                    <div class="card-description">${item.description}</div>
                                    <div class="card-tags">
                                        ${item.tags.slice(0, 3).map(tag => `
                                            <span class="card-tag">${tag}</span>
                                        `).join('')}
                                    </div>
                                    <div class="card-stats">
                                        <span><i class="fas fa-headphones"></i> ${this.formatNumber(item.listeners)}</span>
                                        <span><i class="fas fa-comment"></i> ${item.comments}</span>
                                        <span><i class="fas fa-star"></i> ${item.rating}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    generateNoResultsHTML(query, isRealTime) {
        const suggestions = [
            "检查输入是否正确",
            "尝试其他关键词",
            "搜索更通用的术语",
            "查看热门分类"
        ];

        return `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>没有找到相关结果</h3>
                <p>没有找到与 "<strong>${query}</strong>" 相关的内容</p>
                
                <div class="suggestions">
                    <h4>建议：</h4>
                    <ul>
                        ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="no-results-actions">
                    <button class="btn btn-primary go-to-discover-btn">
                        <i class="fas fa-compass"></i> 去发现页看看
                    </button>
                    <button class="btn btn-outline clear-search-btn">
                        <i class="fas fa-times"></i> 清除搜索
                    </button>
                </div>
            </div>
        `;
    }

    bindSearchResultEvents() {
        // 绑定搜索结果点击事件
        document.querySelectorAll('.search-result-card, .realtime-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                const type = item.getAttribute('data-type');
                
                this.hideSearchModal();
                
                if (type === 'live') {
                    if (window.app) window.app.openLiveRoom(id);
                } else {
                    if (window.app) window.app.openPlayer(id);
                }
            });
        });

        // 绑定筛选按钮事件
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterSearchResults(filter);
            });
        });

        // 绑定去发现页按钮
        document.querySelectorAll('.go-to-discover-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideSearchModal();
                if (window.app) window.app.navigateTo('discover');
            });
        });

        // 绑定清除搜索按钮
        document.querySelectorAll('.clear-search-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.clearSearch();
            });
        });
    }

    filterSearchResults(filter) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const results = document.querySelectorAll('.search-result-card');
        
        filterBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        results.forEach(item => {
            const type = item.getAttribute('data-type');
            if (filter === 'all' || filter === type) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    clearSearch() {
        const searchInput = document.querySelector('#search-modal input[type="text"]');
        if (searchInput) {
            searchInput.value = '';
        }
        this.hideRealTimeResults();
        this.showSearchSuggestions();
    }

    hideSearchModal() {
        const modal = document.getElementById('search-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // 推荐相关功能
    shuffleRecommendations() {
        // 随机打乱推荐内容
        const shuffled = [...this.allContent].sort(() => Math.random() - 0.5);
        this.currentRecommendations = shuffled.slice(0, 6); // 每次显示6个
    }

    updateRecommendationsUI() {
        // 更新首页推荐内容
        const featuredGrid = document.getElementById('featured-content');
        const liveGrid = document.getElementById('live-content');
        
        if (featuredGrid) {
            const audioContent = this.currentRecommendations.filter(item => item.type === 'audio');
            featuredGrid.innerHTML = audioContent.map(item => this.generateContentCardHTML(item)).join('');
        }
        
        if (liveGrid) {
            const liveContent = this.currentRecommendations.filter(item => item.type === 'live');
            liveGrid.innerHTML = liveContent.map(item => this.generateContentCardHTML(item)).join('');
        }

        // 重新绑定点击事件
        this.bindContentCardEvents();
    }

    generateContentCardHTML(item) {
        return `
            <div class="content-card" data-id="${item.id}" data-type="${item.type}">
                <div class="card-image" style="background: ${item.color};">
                    <i class="${item.icon}"></i>
                    ${item.isLive ? '<div class="live-badge"><i class="fas fa-circle"></i> 直播中</div>' : ''}
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-creator">
                        <div class="creator-avatar"></div>
                        <span>${item.creator}</span>
                    </div>
                    <div class="card-stats">
                        <span><i class="fas fa-headphones"></i> ${this.formatNumber(item.listeners)}</span>
                        <span><i class="fas fa-comment"></i> ${item.comments}</span>
                        <span><i class="fas fa-star"></i> ${item.rating}</span>
                    </div>
                </div>
            </div>
        `;
    }

    bindContentCardEvents() {
        // 绑定内容卡片点击事件
        document.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const cardId = card.getAttribute('data-id');
                const cardType = card.getAttribute('data-type');
                
                if (cardType === 'live') {
                    if (window.app) window.app.openLiveRoom(cardId);
                } else {
                    if (window.app) window.app.openPlayer(cardId);
                }
            });
        });
    }

    // 搜索历史管理
    getSearchHistory() {
        const history = localStorage.getItem('starryVoiceSearchHistory');
        return history ? JSON.parse(history) : [];
    }

    addToSearchHistory(query) {
        const history = this.getSearchHistory();
        // 移除重复项
        const filteredHistory = history.filter(item => item !== query);
        // 添加到开头
        filteredHistory.unshift(query);
        // 限制历史记录数量
        const limitedHistory = filteredHistory.slice(0, 10);
        localStorage.setItem('starryVoiceSearchHistory', JSON.stringify(limitedHistory));
    }

    removeFromSearchHistory(query) {
        const history = this.getSearchHistory();
        const filteredHistory = history.filter(item => item !== query);
        localStorage.setItem('starryVoiceSearchHistory', JSON.stringify(filteredHistory));
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
}

// 初始化搜索管理器
let searchManager = null;

document.addEventListener('DOMContentLoaded', () => {
    searchManager = new SearchManager();
    window.searchManager = searchManager;
});