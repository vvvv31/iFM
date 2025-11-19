// 星之声应用主逻辑
class StarryVoiceApp {
    constructor() {
        this.currentPage = 'home';
        this.currentAudio = null;
        this.isPlaying = false;
        this.userData = this.loadUserData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPage('home');
        this.updateUserInfo();
    }

    bindEvents() {
        // 导航链接点击事件
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // 搜索按钮
        document.querySelector('.search-btn').addEventListener('click', () => {
            this.showSearchModal();
        });

        // 用户头像点击
        document.querySelector('.user-avatar').addEventListener('click', () => {
            this.navigateTo('profile');
        });

        // 模态框关闭
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal);
            });
        });

        // 点击模态框背景关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.hideModal(modal);
                }
            });
        });

        // 分类切换
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category')) {
                this.switchCategory(e.target);
            }
        });

        // 内容卡片点击 - 修复的点击事件
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.content-card');
            if (card) {
                e.preventDefault();
                e.stopPropagation();
                this.handleCardClick(card);
            }
        });

        // 开始直播确认
        const startLiveConfirmBtn = document.querySelector('.start-live-confirm-btn');
        if (startLiveConfirmBtn) {
            startLiveConfirmBtn.addEventListener('click', () => {
                this.confirmStartLive();
            });
        }

        // 取消直播
        const cancelLiveBtn = document.querySelector('.cancel-live-btn');
        if (cancelLiveBtn) {
            cancelLiveBtn.addEventListener('click', () => {
                this.hideModal(document.getElementById('start-live-modal'));
            });
        }

        // 评论提交
        document.addEventListener('click', (e) => {
            if (e.target.closest('.comment-submit-btn')) {
                this.submitComment();
            }
        });

        // 弹幕提交
        document.addEventListener('click', (e) => {
            if (e.target.closest('.danmaku-submit-btn')) {
                this.submitDanmaku();
            }
        });
    }

    navigateTo(page) {
        console.log('导航到页面:', page);
        
        // 更新导航状态
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        const targetLink = document.querySelector(`[data-page="${page}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }

        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;

            // 加载页面内容
            this.loadPage(page);
        }
    }

    loadPage(page) {
        console.log('加载页面:', page);
        const pageElement = document.getElementById(page);
        
        switch(page) {
            case 'home':
                this.loadHomePage();
                break;
            case 'discover':
                this.loadDiscoverPage();
                break;
            case 'player':
                this.loadPlayerPage();
                break;
            case 'live':
                this.loadLivePage();
                break;
            case 'profile':
                this.loadProfilePage();
                break;
        }
    }

    loadHomePage() {
        const homePage = document.getElementById('home');
        
        // 显示加载状态
        homePage.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;

        // 模拟数据加载
        setTimeout(() => {
            homePage.innerHTML = this.generateHomeContent();
            this.bindHomeEvents();
        }, 500);
    }

    generateHomeContent() {
        return `
            <div class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">每一颗星，都有回音</h1>
                    <p class="hero-subtitle">在浩瀚的星空下，用声音连接彼此，找到温暖与陪伴</p>
                    <div class="hero-actions">
                        <button class="btn btn-primary explore-btn"><i class="fas fa-play-circle"></i> 立即体验</button>
                        <button class="btn btn-outline" style="color: white; border-color: white;">了解更多</button>
                    </div>
                </div>
            </div>

            <div class="categories">
                <div class="category active">推荐</div>
                <div class="category">直播中</div>
                <div class="category">通勤必备</div>
                <div class="category">助眠放松</div>
                <div class="category">学习提升</div>
                <div class="category">情感陪伴</div>
                <div class="category">热门互动</div>
            </div>

            <h2 class="page-title"><i class="fas fa-fire"></i> 热门内容</h2>
            <div class="content-grid" id="featured-content">
                ${this.generateContentCards('featured')}
            </div>

            <h2 class="page-title"><i class="fas fa-broadcast-tower"></i> 直播推荐</h2>
            <div class="content-grid" id="live-content">
                ${this.generateContentCards('live')}
            </div>

            <h2 class="page-title"><i class="fas fa-history"></i> 最近收听</h2>
            <div class="content-grid" id="recent-content">
                ${this.generateContentCards('recent')}
            </div>
        `;
    }

    generateContentCards(type) {
        const contentData = {
            featured: [
                {
                    id: 1,
                    title: "深夜星空电台：孤独与陪伴",
                    creator: "星空主播小雅",
                    type: "audio",
                    listeners: 1200,
                    comments: 86,
                    rating: 4.8,
                    isLive: false,
                    color: "linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)",
                    icon: "fas fa-headphones"
                },
                {
                    id: 2,
                    title: "文学星空：经典短篇小说赏析",
                    creator: "文心老师",
                    type: "audio",
                    listeners: 3400,
                    comments: 124,
                    rating: 4.9,
                    isLive: false,
                    color: "linear-gradient(135deg, #f48fb1 0%, #d81b60 100%)",
                    icon: "fas fa-book-open"
                },
                {
                    id: 3,
                    title: "英语星空：地道表达每日一句",
                    creator: "英语小助手",
                    type: "audio",
                    listeners: 5700,
                    comments: 203,
                    rating: 4.7,
                    isLive: false,
                    color: "linear-gradient(135deg, #81c784 0%, #388e3c 100%)",
                    icon: "fas fa-language"
                }
            ],
            live: [
                {
                    id: 5,
                    title: "心理星空：如何应对焦虑情绪",
                    creator: "心理咨询师李老师",
                    type: "live",
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
                    listeners: 892,
                    comments: 167,
                    rating: 4.8,
                    isLive: true,
                    color: "linear-gradient(135deg, #ffb74d 0%, #f57c00 100%)",
                    icon: "fas fa-music"
                }
            ],
            recent: [
                {
                    id: 4,
                    title: "科技星空：AI技术前沿",
                    creator: "科技达人",
                    type: "audio",
                    listeners: 2300,
                    comments: 89,
                    rating: 4.6,
                    isLive: false,
                    color: "linear-gradient(135deg, #ba68c8 0%, #8e24aa 100%)",
                    icon: "fas fa-robot"
                }
            ]
        };

        const cards = contentData[type] || [];
        return cards.map(card => `
            <div class="content-card" data-id="${card.id}" data-type="${card.type}">
                <div class="card-image" style="background: ${card.color};">
                    <i class="${card.icon}"></i>
                    ${card.isLive ? '<div class="live-badge"><i class="fas fa-circle"></i> 直播中</div>' : ''}
                </div>
                <div class="card-content">
                    <h3 class="card-title">${card.title}</h3>
                    <div class="card-creator">
                        <div class="creator-avatar"></div>
                        <span>${card.creator}</span>
                    </div>
                    <div class="card-stats">
                        <span><i class="fas fa-headphones"></i> ${this.formatNumber(card.listeners)}</span>
                        <span><i class="fas fa-comment"></i> ${card.comments}</span>
                        <span><i class="fas fa-star"></i> ${card.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleCardClick(card) {
        const cardId = card.getAttribute('data-id');
        const cardType = card.getAttribute('data-type');
        
        console.log('点击卡片:', { cardId, cardType });
        
        if (cardType === 'live') {
            this.openLiveRoom(cardId);
        } else {
            this.openPlayer(cardId);
        }
    }

    openPlayer(audioId) {
        console.log('打开播放器:', audioId);
        this.navigateTo('player');
        
        // 确保播放器页面加载完成后再初始化
        setTimeout(() => {
            if (window.audioPlayer) {
                window.audioPlayer.loadAudio(parseInt(audioId));
                console.log('播放器加载完成');
            } else {
                console.error('AudioPlayer 未初始化');
            }
        }, 300);
    }

    openLiveRoom(liveId) {
        console.log('打开直播房间:', liveId);
        this.navigateTo('live');
        
        // 确保直播页面加载完成后再初始化
        setTimeout(() => {
            if (window.liveStream) {
                window.liveStream.loadLiveStream(parseInt(liveId));
                console.log('直播加载完成');
            } else {
                console.error('LiveStream 未初始化');
            }
        }, 300);
    }

    loadPlayerPage() {
        const playerPage = document.getElementById('player');
        playerPage.innerHTML = this.generatePlayerContent();
        
        // 绑定播放器事件
        setTimeout(() => {
            if (window.audioPlayer) {
                // 播放器已经在初始化时创建，这里只需要更新界面
                console.log('播放器页面已加载');
            }
        }, 100);
    }

    generatePlayerContent() {
        return `
            <div class="player-container">
                <div class="player-main">
                    <div class="player-header">
                        <div class="player-cover">
                            <i class="fas fa-headphones"></i>
                        </div>
                        <div class="player-info">
                            <h2>选择音频开始播放</h2>
                            <p>请从首页选择音频内容</p>
                        </div>
                    </div>

                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: 0%;"></div>
                        </div>
                        <div class="progress-time">
                            <span>0:00</span>
                            <span>0:00</span>
                        </div>
                    </div>

                    <div class="player-controls">
                        <button class="control-btn prev-btn"><i class="fas fa-step-backward"></i></button>
                        <button class="control-btn backward-btn"><i class="fas fa-backward"></i></button>
                        <button class="control-btn play-btn play-pause-btn"><i class="fas fa-play"></i></button>
                        <button class="control-btn forward-btn"><i class="fas fa-forward"></i></button>
                        <button class="control-btn next-btn"><i class="fas fa-step-forward"></i></button>
                    </div>

                    <div class="player-actions">
                        <button class="action-btn like-btn"><i class="far fa-heart"></i> 收藏</button>
                        <button class="action-btn download-btn"><i class="fas fa-download"></i> 下载</button>
                        <button class="action-btn share-btn"><i class="fas fa-share-alt"></i> 分享</button>
                        <button class="action-btn playlist-btn"><i class="fas fa-list"></i> 添加到列表</button>
                        <button class="action-btn settings-btn"><i class="fas fa-cog"></i> 设置</button>
                    </div>

                    <div class="playback-controls">
                        <label>播放速度:</label>
                        <select class="playback-rate-select">
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1.0" selected>1.0x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2.0">2.0x</option>
                        </select>
                        
                        <label>音量:</label>
                        <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="0.8">
                    </div>
                </div>

                <div class="player-sidebar">
                    <div class="comments-section">
                        <h3 class="comments-title"><i class="fas fa-comments"></i> 评论</h3>
                        <div class="comments-list">
                            <div class="comment">
                                <div class="comment-avatar"></div>
                                <div class="comment-content">
                                    <h4>星空旅人</h4>
                                    <p>选择音频后开始收听吧</p>
                                    <div class="comment-time">刚刚</div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-input-container">
                            <input type="text" class="comment-input" placeholder="写下你的评论...">
                            <button class="comment-submit-btn">发送</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadLivePage() {
        const livePage = document.getElementById('live');
        livePage.innerHTML = this.generateLiveRoomContent();
        
        // 绑定直播事件
        setTimeout(() => {
            if (window.liveStream) {
                console.log('直播页面已加载');
            }
        }, 100);
    }

    generateLiveRoomContent() {
        return `
            <div class="live-container">
                <div class="live-main">
                    <div class="live-player">
                        <div class="live-indicator">
                            <div class="live-pulse"></div>
                            <span>准备中</span>
                        </div>
                        <h2 class="live-title">选择直播房间</h2>
                        <div class="live-host">
                            <div class="host-avatar"></div>
                            <span>主播</span>
                        </div>
                        <div class="live-description">
                            请从首页选择直播内容进入房间
                        </div>
                        <div class="live-actions">
                            <button class="btn btn-primary request-mic-btn"><i class="fas fa-microphone-alt"></i> 申请连麦</button>
                            <button class="btn btn-outline gift-btn" style="color: white; border-color: white;"><i class="fas fa-gift"></i> 送礼物</button>
                            <button class="btn btn-outline share-live-btn" style="color: white; border-color: white;"><i class="fas fa-share-alt"></i> 分享</button>
                        </div>
                    </div>

                    <div class="comments-section" style="border-radius: 0 0 15px 15px;">
                        <h3 class="comments-title"><i class="fas fa-comment-dots"></i> 弹幕互动</h3>
                        <div class="comments-list">
                            <div class="comment system-message">
                                <div class="comment-content system">
                                    <p>欢迎来到直播间！</p>
                                    <div class="comment-time">刚刚</div>
                                </div>
                            </div>
                        </div>
                        <div class="danmaku-input-container">
                            <input type="text" class="danmaku-input" placeholder="发送弹幕...">
                            <button class="danmaku-submit-btn">发送</button>
                        </div>
                    </div>
                </div>

                <div class="live-sidebar">
                    <div class="online-users">
                        <h3 class="section-title"><i class="fas fa-users"></i> 在线听众 (0)</h3>
                        <div class="user-list">
                            <div class="user-item">
                                <div class="user-avatar"></div>
                                <div class="user-info">
                                    <h4>我</h4>
                                    <p>听众</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mic-request">
                        <h3 class="section-title"><i class="fas fa-microphone-alt"></i> 连麦申请</h3>
                        <p style="margin-bottom: 15px; font-size: 14px; color: #666;">与主播和其他听众语音交流，分享你的想法</p>
                        <button class="request-btn request-mic-sidebar-btn"><i class="fas fa-microphone"></i> 申请连麦</button>
                    </div>

                    <div class="gift-selection">
                        <h3 class="section-title"><i class="fas fa-gift"></i> 礼物</h3>
                        <div class="gift-items">
                            <div class="gift-item" data-gift="star">
                                <div class="gift-icon">⭐</div>
                                <div class="gift-name">星星</div>
                                <div class="gift-price">1</div>
                            </div>
                            <div class="gift-item" data-gift="moon">
                                <div class="gift-icon">🌙</div>
                                <div class="gift-name">月亮</div>
                                <div class="gift-price">5</div>
                            </div>
                            <div class="gift-item" data-gift="sun">
                                <div class="gift-icon">☀️</div>
                                <div class="gift-name">太阳</div>
                                <div class="gift-price">10</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    submitComment() {
        const commentInput = document.querySelector('.comment-input');
        if (!commentInput || !commentInput.value.trim()) return;

        const comment = commentInput.value;
        commentInput.value = '';
        this.showNotification('评论发送成功');
        
        // 这里可以添加实际的评论提交逻辑
        console.log('发送评论:', comment);
    }

    submitDanmaku() {
        const danmakuInput = document.querySelector('.danmaku-input');
        if (!danmakuInput || !danmakuInput.value.trim()) return;

        const danmaku = danmakuInput.value;
        danmakuInput.value = '';
        this.showNotification('弹幕发送成功');
        
        // 这里可以添加实际的弹幕提交逻辑
        console.log('发送弹幕:', danmaku);
    }

    bindHomeEvents() {
        // 探索按钮
        const exploreBtn = document.querySelector('.explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.navigateTo('discover');
            });
        }
    }

    loadDiscoverPage() {
        const discoverPage = document.getElementById('discover');
        discoverPage.innerHTML = `
            <h1 class="page-title"><i class="fas fa-compass"></i> 发现</h1>
            <div class="discover-filters">
                <div class="filter-group">
                    <label>分类:</label>
                    <select class="filter-select">
                        <option>全部</option>
                        <option>知识</option>
                        <option>娱乐</option>
                        <option>情感</option>
                        <option>学习</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>排序:</label>
                    <select class="filter-select">
                        <option>最新</option>
                        <option>最热</option>
                        <option>评分最高</option>
                    </select>
                </div>
            </div>
            <div class="content-grid">
                ${this.generateContentCards('featured')}
                ${this.generateContentCards('live')}
            </div>
        `;
    }

    loadProfilePage() {
        const profilePage = document.getElementById('profile');
        profilePage.innerHTML = `
            <h1 class="page-title"><i class="fas fa-user"></i> 个人中心</h1>
            <div class="profile-tabs">
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="subscriptions">我的订阅</button>
                    <button class="tab-btn" data-tab="library">我的收藏</button>
                    <button class="tab-btn" data-tab="history">收听历史</button>
                    <button class="tab-btn" data-tab="creator">创作者中心</button>
                </div>
                
                <div class="tab-content">
                    <div class="tab-pane active" id="subscriptions-tab">
                        ${this.generateSubscriptionsContent()}
                    </div>
                    <div class="tab-pane" id="library-tab">
                        ${this.generateLibraryContent()}
                    </div>
                    <div class="tab-pane" id="history-tab">
                        ${this.generateHistoryContent()}
                    </div>
                    <div class="tab-pane" id="creator-tab">
                        ${this.generateCreatorContent()}
                    </div>
                </div>
            </div>
        `;
        
        this.bindProfileTabEvents();
    }

    generateSubscriptionsContent() {
        return `
            <div class="tab-section">
                <h3><i class="fas fa-heart"></i> 已订阅的电台</h3>
                <div class="content-grid">
                    ${this.generateContentCards('featured').slice(0, 2)}
                </div>
            </div>
            
            <div class="tab-section">
                <h3><i class="fas fa-user-plus"></i> 已关注的创作者</h3>
                <div class="creator-list">
                    <div class="creator-item">
                        <div class="creator-avatar large"></div>
                        <div class="creator-info">
                            <h4>星空主播小雅</h4>
                            <p>12个节目 · 1.2k 粉丝</p>
                            <button class="btn btn-outline follow-btn">已关注</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateLibraryContent() {
        return `
            <div class="empty-state">
                <i class="fas fa-bookmark"></i>
                <h4>暂无收藏内容</h4>
                <p>您收藏的节目和直播将显示在这里</p>
                <button class="btn btn-primary" onclick="app.navigateTo('discover')">去发现精彩内容</button>
            </div>
        `;
    }

    generateHistoryContent() {
        return `
            <div class="content-grid">
                ${this.generateContentCards('recent')}
            </div>
        `;
    }

    generateCreatorContent() {
        const isCreator = this.userData.isCreator || false;
        
        if (!isCreator) {
            return `
                <div class="empty-state">
                    <i class="fas fa-microphone"></i>
                    <h4>您还不是创作者</h4>
                    <p>成为创作者，开始分享您的声音故事</p>
                    <button class="btn btn-primary" onclick="app.becomeCreator()">申请成为创作者</button>
                </div>
            `;
        }

        return `
            <div class="creator-stats">
                <div class="stat-card">
                    <div class="stat-number">${this.userData.creatorStats?.listeners || 0}</div>
                    <div class="stat-label">总收听</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${this.userData.creatorStats?.followers || 0}</div>
                    <div class="stat-label">粉丝</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${this.userData.creatorStats?.programs || 0}</div>
                    <div class="stat-label">节目数</div>
                </div>
            </div>

            <div class="creator-actions">
                <div class="action-card" onclick="app.startLiveStream()">
                    <i class="fas fa-broadcast-tower"></i>
                    <h4>开始直播</h4>
                    <p>与听众实时互动，分享您的想法</p>
                </div>
                <div class="action-card" onclick="app.uploadProgram()">
                    <i class="fas fa-upload"></i>
                    <h4>上传节目</h4>
                    <p>上传录制好的音频节目</p>
                </div>
            </div>
        `;
    }

    bindProfileTabEvents() {
        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchProfileTab(tabName);
            });
        });

        // 关注按钮
        document.querySelectorAll('.follow-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleFollow(e.target);
            });
        });
    }

    switchProfileTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    becomeCreator() {
        this.userData.isCreator = true;
        this.userData.creatorStats = {
            listeners: 0,
            followers: 0,
            programs: 0
        };
        this.saveUserData();
        
        this.showNotification('恭喜！您已成为创作者');
        this.loadProfilePage();
    }

    startLiveStream() {
        this.showStartLiveModal();
    }

    showStartLiveModal() {
        document.getElementById('start-live-modal').classList.add('active');
    }

    confirmStartLive() {
        const title = document.querySelector('.live-title-input').value;
        const category = document.querySelector('.live-category-select').value;
        const tags = document.querySelector('.live-tags-input').value;

        if (!title.trim()) {
            this.showNotification('请输入直播标题');
            return;
        }

        this.hideModal(document.getElementById('start-live-modal'));
        this.showNotification('直播准备中...');
        
        // 模拟开始直播，跳转到新直播房间
        setTimeout(() => {
            this.openLiveRoom(100);
        }, 2000);
    }

    uploadProgram() {
        this.showNotification('节目上传功能开发中...');
    }

    toggleFollow(button) {
        const isFollowing = button.textContent === '已关注';
        
        if (isFollowing) {
            button.textContent = '关注';
            button.classList.remove('btn-outline');
            button.classList.add('btn-primary');
            this.showNotification('已取消关注');
        } else {
            button.textContent = '已关注';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline');
            this.showNotification('关注成功');
        }
    }

    showSearchModal() {
        document.getElementById('search-modal').classList.add('active');
    }

    hideModal(modal) {
        modal.classList.remove('active');
    }

    switchCategory(categoryElement) {
        document.querySelectorAll('.category').forEach(cat => {
            cat.classList.remove('active');
        });
        categoryElement.classList.add('active');
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    loadUserData() {
        const saved = localStorage.getItem('starryVoiceUser');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            username: '星空旅人',
            listeningTime: 24,
            following: 12,
            followers: 45,
            isCreator: false
        };
    }

    saveUserData() {
        localStorage.setItem('starryVoiceUser', JSON.stringify(this.userData));
    }

    updateUserInfo() {
        // 更新用户相关信息
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-blue);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--card-shadow);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StarryVoiceApp();
    console.log('星之声应用初始化完成');
});