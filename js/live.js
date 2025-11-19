// 直播功能模块
class LiveStream {
    constructor() {
        this.currentLiveId = null;
        this.isConnected = false;
        this.isRequestingMic = false;
        this.mediaStream = null;
        this.socket = null;
        this.liveData = null;
        this.danmakuInterval = null;
        this.onlineCountInterval = null;
        this.init();
    }

    init() {
        this.bindLiveEvents();
        this.initWebRTC();
    }

    bindLiveEvents() {
        // 连麦申请事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.request-mic-btn') || e.target.closest('.request-mic-sidebar-btn')) {
                this.requestMicrophoneAccess();
            }
        });

        // 礼物发送
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gift-btn')) {
                this.sendGift();
            }
        });

        // 弹幕发送
        document.addEventListener('click', (e) => {
            if (e.target.closest('.danmaku-submit-btn')) {
                this.sendDanmaku();
            }
        });

        // 关注主播
        document.addEventListener('click', (e) => {
            if (e.target.closest('.follow-btn')) {
                this.toggleFollow();
            }
        });

        // 结束连麦
        document.addEventListener('click', (e) => {
            if (e.target.closest('.disconnect-btn')) {
                this.disconnectMic();
            }
        });

        // 分享直播
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-live-btn')) {
                this.shareLive();
            }
        });
    }

    initWebRTC() {
        console.log('WebRTC初始化完成');
    }

    loadLiveStream(liveId) {
        this.currentLiveId = liveId;
        this.liveData = this.getLiveData(liveId);
        this.updateLiveInterface(this.liveData);
        this.connectToLiveStream();
        this.startSimulatedData();
    }

    updateLiveInterface(liveData) {
        // 更新直播界面信息
        const liveTitle = document.querySelector('.live-title');
        if (liveTitle) {
            liveTitle.textContent = liveData.title;
        }

        const hostName = document.querySelector('.live-host span');
        if (hostName) {
            hostName.textContent = liveData.host;
        }

        const onlineCount = document.querySelector('.online-users .section-title');
        if (onlineCount) {
            onlineCount.innerHTML = `<i class="fas fa-users"></i> 在线听众 (${liveData.onlineCount})`;
        }

        const liveDescription = document.querySelector('.live-description');
        if (liveDescription) {
            liveDescription.textContent = liveData.description;
        }

        // 更新主机头像
        const hostAvatar = document.querySelector('.host-avatar');
        if (hostAvatar && liveData.hostAvatarColor) {
            hostAvatar.style.background = liveData.hostAvatarColor;
        }

        // 更新标签
        this.updateLiveTags(liveData.tags);
    }

    updateLiveTags(tags) {
        const tagsContainer = document.querySelector('.live-tags');
        if (!tagsContainer) return;

        tagsContainer.innerHTML = tags.map(tag => 
            `<span class="live-tag">${tag}</span>`
        ).join('');
    }

    async requestMicrophoneAccess() {
        if (this.isRequestingMic) {
            this.showNotification('连麦申请已发送，请等待主播接受');
            return;
        }

        try {
            this.isRequestingMic = true;
            this.showNotification('正在请求麦克风权限...');

            // 模拟麦克风权限请求
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.showNotification('麦克风权限已获取，等待主播接受连麦');
            this.updateMicRequestButtons(true);

            // 模拟主播接受连麦
            setTimeout(() => {
                this.acceptMicRequest();
            }, 3000);

        } catch (error) {
            console.error('获取麦克风权限失败:', error);
            this.showNotification('无法访问麦克风，请检查权限设置');
            this.isRequestingMic = false;
        }
    }

    acceptMicRequest() {
        this.isConnected = true;
        this.isRequestingMic = false;
        
        this.showNotification('连麦申请已接受，开始语音交流');
        this.updateMicRequestButtons(false);
        this.showConnectedUI();
        this.addSystemMessage('主播接受了你的连麦申请');
        
        // 开始处理音频流
        this.processAudioStream();
    }

    rejectMicRequest() {
        this.isConnected = false;
        this.isRequestingMic = false;
        
        this.showNotification('连麦申请被拒绝');
        this.updateMicRequestButtons(false);
        this.addSystemMessage('主播拒绝了你的连麦申请');
    }

    updateMicRequestButtons(isRequesting) {
        const requestButtons = document.querySelectorAll('.request-mic-btn, .request-mic-sidebar-btn');
        
        requestButtons.forEach(button => {
            if (isRequesting) {
                button.innerHTML = '<i class="fas fa-hourglass-half"></i> 等待接受';
                button.disabled = true;
            } else {
                button.innerHTML = '<i class="fas fa-microphone-alt"></i> 申请连麦';
                button.disabled = false;
            }
        });
    }

    showConnectedUI() {
        const liveActions = document.querySelector('.live-actions');
        if (liveActions) {
            liveActions.innerHTML = `
                <button class="btn btn-primary disconnect-btn"><i class="fas fa-phone-slash"></i> 结束连麦</button>
                <button class="btn btn-outline gift-btn" style="color: white; border-color: white;"><i class="fas fa-gift"></i> 送礼物</button>
                <button class="btn btn-outline share-live-btn" style="color: white; border-color: white;"><i class="fas fa-share-alt"></i> 分享</button>
            `;
        }

        this.updateUserListWithMicStatus();
        this.addConnectedUserToPanel();
    }

    addConnectedUserToPanel() {
        const userList = document.querySelector('.user-list');
        if (userList) {
            const connectedUser = document.createElement('div');
            connectedUser.className = 'user-item connected-user';
            connectedUser.innerHTML = `
                <div class="user-avatar" style="background: var(--accent-yellow);"></div>
                <div class="user-info">
                    <h4>我</h4>
                    <p style="color: var(--accent-yellow); font-weight: bold;">连麦中</p>
                </div>
                <div class="user-status">
                    <i class="fas fa-microphone" style="color: var(--accent-yellow);"></i>
                </div>
            `;
            userList.insertBefore(connectedUser, userList.firstChild);
        }
    }

    updateUserListWithMicStatus() {
        const userItems = document.querySelectorAll('.user-item:not(.connected-user)');
        userItems.forEach(item => {
            const userInfo = item.querySelector('.user-info p');
            if (userInfo) {
                userInfo.textContent = '听众';
            }
        });
    }

    processAudioStream() {
        console.log('开始处理音频流...');
        // 这里实际会初始化WebRTC连接
    }

    disconnectMic() {
        this.isConnected = false;
        
        this.showNotification('连麦已结束');
        this.updateMicRequestButtons(false);
        this.restoreOriginalUI();
        this.addSystemMessage('你结束了连麦');
        
        // 移除连麦用户
        const connectedUser = document.querySelector('.connected-user');
        if (connectedUser) {
            connectedUser.remove();
        }
    }

    restoreOriginalUI() {
        const liveActions = document.querySelector('.live-actions');
        if (liveActions) {
            liveActions.innerHTML = `
                <button class="btn btn-primary request-mic-btn"><i class="fas fa-microphone-alt"></i> 申请连麦</button>
                <button class="btn btn-outline gift-btn" style="color: white; border-color: white;"><i class="fas fa-gift"></i> 送礼物</button>
                <button class="btn btn-outline share-live-btn" style="color: white; border-color: white;"><i class="fas fa-share-alt"></i> 分享</button>
            `;
        }
    }

    connectToLiveStream() {
        this.showNotification('正在连接到直播...');
        
        setTimeout(() => {
            this.isConnected = true;
            this.showNotification('直播连接成功');
            this.addSystemMessage('你进入了直播间');
        }, 1000);
    }

    startSimulatedData() {
        // 模拟实时弹幕
        this.danmakuInterval = setInterval(() => {
            this.addSimulatedDanmaku();
        }, 3000);

        // 模拟在线人数变化
        this.onlineCountInterval = setInterval(() => {
            this.updateOnlineCount();
        }, 5000);

        // 初始弹幕
        setTimeout(() => {
            this.addSystemMessage('欢迎来到直播间！');
        }, 1000);
    }

    stopSimulatedData() {
        if (this.danmakuInterval) {
            clearInterval(this.danmakuInterval);
            this.danmakuInterval = null;
        }
        if (this.onlineCountInterval) {
            clearInterval(this.onlineCountInterval);
            this.onlineCountInterval = null;
        }
    }

    updateOnlineCount() {
        const onlineCountElement = document.querySelector('.online-users .section-title');
        if (onlineCountElement && this.liveData) {
            const change = Math.floor(Math.random() * 10) - 3;
            this.liveData.onlineCount = Math.max(1, this.liveData.onlineCount + change);
            onlineCountElement.innerHTML = `<i class="fas fa-users"></i> 在线听众 (${this.liveData.onlineCount})`;
        }
    }

    addSimulatedDanmaku() {
        const danmakuMessages = [
            "主播讲得真好！",
            "这个观点我同意",
            "有没有人一起聊天？",
            "声音很好听",
            "今天话题很有意思",
            "学到了新知识",
            "支持主播！",
            "可以点歌吗？",
            "连麦怎么申请？",
            "礼物已送，继续加油！"
        ];

        const randomMessage = danmakuMessages[Math.floor(Math.random() * danmakuMessages.length)];
        const randomUser = this.getRandomUserName();
        
        this.addDanmakuToChat(randomUser, randomMessage);
    }

    getRandomUserName() {
        const users = ["星空旅人", "夜行侠", "星辰大海", "月光奏鸣曲", "银河漫游者", "宇宙观察员", "星际旅客"];
        return users[Math.floor(Math.random() * users.length)];
    }

    addDanmakuToChat(username, message, isSystem = false) {
        const commentsSection = document.querySelector('.comments-section');
        if (!commentsSection) return;

        const commentList = commentsSection.querySelector('.comment:first-child')?.parentNode;
        if (!commentList) return;

        const newComment = document.createElement('div');
        newComment.className = `comment ${isSystem ? 'system-message' : ''}`;
        
        if (isSystem) {
            newComment.innerHTML = `
                <div class="comment-content system">
                    <p>${message}</p>
                    <div class="comment-time">刚刚</div>
                </div>
            `;
        } else {
            newComment.innerHTML = `
                <div class="comment-avatar"></div>
                <div class="comment-content">
                    <h4>${username}</h4>
                    <p>${message}</p>
                    <div class="comment-time">刚刚</div>
                </div>
            `;
        }

        commentList.insertBefore(newComment, commentList.firstChild);

        // 限制显示数量
        const allComments = commentList.querySelectorAll('.comment');
        if (allComments.length > 50) {
            commentList.removeChild(allComments[allComments.length - 1]);
        }

        // 自动滚动到最新消息
        commentList.scrollTop = 0;
    }

    addSystemMessage(message) {
        this.addDanmakuToChat('', message, true);
    }

    sendDanmaku() {
        const danmakuInput = document.querySelector('.danmaku-input');
        if (!danmakuInput || !danmakuInput.value.trim()) return;

        const message = danmakuInput.value;
        this.addDanmakuToChat('我', message);
        danmakuInput.value = '';
        this.showNotification('弹幕发送成功');

        // 模拟其他用户回复
        setTimeout(() => {
            const replies = [
                "说得对！",
                "我也这么觉得",
                "哈哈，有意思",
                "支持你的观点"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const randomUser = this.getRandomUserName();
            this.addDanmakuToChat(randomUser, randomReply);
        }, 2000);
    }

    sendGift() {
        const gifts = [
            { name: "星星", value: 1, icon: "⭐" },
            { name: "月亮", value: 5, icon: "🌙" },
            { name: "太阳", value: 10, icon: "☀️" },
            { name: "银河", value: 50, icon: "🌌" }
        ];

        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        this.showNotification(`赠送了${randomGift.name} ×1`);
        this.showGiftAnimation(randomGift);
        this.addSystemMessage(`感谢 我 赠送的 ${randomGift.icon} ${randomGift.name}`);

        // 模拟其他用户送礼
        setTimeout(() => {
            const randomUser = this.getRandomUserName();
            const userGift = gifts[Math.floor(Math.random() * 2)]; // 只送小礼物
            this.addSystemMessage(`感谢 ${randomUser} 赠送的 ${userGift.icon} ${userGift.name}`);
        }, 3000);
    }

    showGiftAnimation(gift) {
        const giftAnimation = document.createElement('div');
        giftAnimation.className = 'gift-animation';
        giftAnimation.innerHTML = `
            <div class="gift-icon">${gift.icon}</div>
            <div class="gift-text">感谢赠送 ${gift.name}！</div>
        `;

        giftAnimation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 1000;
            animation: giftPop 2s ease-in-out;
            text-align: center;
        `;

        document.body.appendChild(giftAnimation);

        setTimeout(() => {
            if (giftAnimation.parentNode) {
                giftAnimation.parentNode.removeChild(giftAnimation);
            }
        }, 2000);
    }

    toggleFollow() {
        const followBtn = document.querySelector('.follow-btn');
        if (followBtn) {
            const isFollowing = followBtn.textContent.includes('已关注');
            
            if (isFollowing) {
                followBtn.innerHTML = '<i class="fas fa-plus"></i> 关注';
                followBtn.classList.remove('btn-outline');
                followBtn.classList.add('btn-primary');
                this.showNotification('已取消关注');
                this.addSystemMessage('你取消关注了主播');
            } else {
                followBtn.innerHTML = '<i class="fas fa-check"></i> 已关注';
                followBtn.classList.remove('btn-primary');
                followBtn.classList.add('btn-outline');
                this.showNotification('关注成功');
                this.addSystemMessage('你关注了主播');
            }
        }
    }

    shareLive() {
        this.showNotification('直播链接已复制到剪贴板');
        // 实际项目中这里会复制直播链接
    }

    showNotification(message) {
        if (window.audioPlayer && window.audioPlayer.showNotification) {
            window.audioPlayer.showNotification(message);
        } else {
            console.log('通知:', message);
        }
    }

    // 模拟直播数据
    getLiveData(liveId) {
        const liveLibrary = {
            5: {
                id: 5,
                title: "心理星空：如何应对焦虑情绪",
                host: "心理咨询师李老师",
                onlineCount: 756,
                hostAvatarColor: "linear-gradient(135deg, var(--accent-yellow) 0%, #ff9800 100%)",
                category: "心理健康",
                tags: ["焦虑", "心理", "情绪管理", "心理健康"],
                description: "在这个快节奏的社会中，我们都会面临各种压力。今晚让我们一起来聊聊如何识别和应对焦虑情绪，找到内心的平静。"
            },
            6: {
                id: 6,
                title: "学习星空：高效备考技巧分享",
                host: "学霸小陈",
                onlineCount: 1100,
                hostAvatarColor: "linear-gradient(135deg, #4db6ac 0%, #00897b 100%)",
                category: "学习",
                tags: ["备考", "学习技巧", "效率", "考试"],
                description: "分享实用的备考方法和学习技巧，帮助大家在考试中取得好成绩。欢迎连麦交流你的学习心得！"
            },
            100: {
                id: 100,
                title: "星空夜话：音乐与心情",
                host: "音乐主播小雅",
                onlineCount: 324,
                hostAvatarColor: "linear-gradient(135deg, #f48fb1 0%, #d81b60 100%)",
                category: "音乐",
                tags: ["音乐", "心情", "点歌", "放松"],
                description: "用音乐温暖每一个夜晚，分享好听的歌曲，聊聊音乐背后的故事。欢迎点歌！"
            }
        };
        
        return liveLibrary[liveId] || liveLibrary[5];
    }

    // 清理资源
    destroy() {
        this.stopSimulatedData();
        this.disconnectMic();
    }
}

// 初始化直播功能
let liveStream = null;

document.addEventListener('DOMContentLoaded', () => {
    liveStream = new LiveStream();
    
    if (window.app) {
        window.app.liveStream = liveStream;
    }
});

// 添加直播相关CSS
const liveStyle = document.createElement('style');
liveStyle.textContent = `
    @keyframes giftPop {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }

    .live-tags {
        display: flex;
        gap: 8px;
        margin: 15px 0;
        flex-wrap: wrap;
    }

    .live-tag {
        padding: 4px 12px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        font-size: 12px;
        color: white;
    }

    .live-description {
        margin: 15px 0;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.5;
        text-align: center;
        max-width: 600px;
    }

    .system-message {
        opacity: 0.7;
    }

    .system-message .comment-content.system {
        text-align: center;
        color: #666;
        font-style: italic;
    }

    .system-message .comment-content.system p {
        margin: 0;
    }

    .user-status {
        margin-left: auto;
    }

    .connected-user {
        background: rgba(255, 193, 7, 0.1) !important;
        border-left: 3px solid var(--accent-yellow);
    }

    .danmaku-input-container {
        display: flex;
        gap: 10px;
        padding: 15px;
        background: #f8f9fa;
        border-top: 1px solid #eee;
    }

    .danmaku-input {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        font-size: 14px;
    }

    .danmaku-submit-btn {
        padding: 10px 20px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
    }

    .comments-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .comments-list::-webkit-scrollbar {
        width: 6px;
    }

    .comments-list::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    .comments-list::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }
`;
document.head.appendChild(liveStyle);