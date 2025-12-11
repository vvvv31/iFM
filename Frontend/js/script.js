// 全局变量
let isPlaying = false;
let currentTime = 0;
let totalTime = 360; // 示例总时长6分钟
let currentProgress = 0;
let pkTimer = null;
let stats = {
    viewers: 0,
    likes: 0,
    gifts: 0,
    comments: 0,
    duration: 0,
    revenue: 0
};
const currentUser = { id: 'user_' + Math.random().toString(36).substr(2, 9) }; // 生成随机用户ID
let ws;

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 格式化时长（用于直播时长）
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 更新播放器UI
function updatePlayerUI() {
    // 这里可以添加全局播放器状态更新逻辑
}

// 播放页面特定功能
function initPlayerPage() {
    // 播放页面DOM元素
    const playBtnLarge = document.querySelector('.play-btn-large');
    const prevBtnLarge = document.querySelector('.prev-btn-large');
    const nextBtnLarge = document.querySelector('.next-btn-large');
    const progressBarLarge = document.querySelector('.progress-bar-large');
    const progressFillLarge = document.querySelector('.progress-fill-large');
    const currentTimeLargeEl = document.querySelector('.current-time-large');
    const totalTimeLargeEl = document.querySelector('.total-time-large');
    const chapterItems = document.querySelectorAll('.chapter-item');
    const recommendItems = document.querySelectorAll('.recommend-item');
    const playNowBtns = document.querySelectorAll('.play-now-btn');
    const backBtn = document.querySelector('.back-btn');

    // 如果是播放页面，初始化相关功能
    if (playBtnLarge) {
        // 更新播放页面的时间显示
        if (currentTimeLargeEl) currentTimeLargeEl.textContent = formatTime(currentTime);
        if (totalTimeLargeEl) totalTimeLargeEl.textContent = formatTime(totalTime);
        if (progressFillLarge) progressFillLarge.style.width = currentProgress + '%';

        // 大播放按钮功能
        playBtnLarge.addEventListener('click', function() {
            isPlaying = !isPlaying;
            updatePlayerUI();
            // 更新大播放按钮样式

            if (isPlaying) {
                this.classList.add('play-active');
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="10" y="7" width="4" height="10"></rect>
                        <rect x="18" y="7" width="4" height="10"></rect>
                    </svg>
                `;
            } else {
                this.classList.remove('play-active');
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 8 22 16 12 24"></polygon>
                    </svg>
                `;
            }
            console.log(isPlaying ? '开始播放' : '暂停播放');

            // 发送播放状态到服务器
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'play_state',
                    isPlaying: isPlaying,
                    userId: currentUser.id
                }));
            }
        });

        // 播放页面的上一首/下一首按钮
        if (prevBtnLarge) {
            prevBtnLarge.addEventListener('click', function() {
                console.log('上一首');
                currentProgress = 0;
                currentTime = 0;
                updatePlayerUI();
                // 更新播放页面UI
                if (currentTimeLargeEl) currentTimeLargeEl.textContent = formatTime(currentTime);
                if (progressFillLarge) progressFillLarge.style.width = currentProgress + '%';

                // 发送切换歌曲事件
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'change_song',
                        direction: 'prev',
                        userId: currentUser.id
                    }));
                }
            });
        }


        if (nextBtnLarge) {
            nextBtnLarge.addEventListener('click', function() {
                console.log('下一首');
                currentProgress = 0;
                currentTime = 0;
                updatePlayerUI();
                // 更新播放页面UI
                if (currentTimeLargeEl) currentTimeLargeEl.textContent = formatTime(currentTime);
                if (progressFillLarge) progressFillLarge.style.width = currentProgress + '%';

                // 发送切换歌曲事件
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'change_song',
                        direction: 'next',
                        userId: currentUser.id
                    }));
                }
            });
        }

        // 播放页面进度条交互
        if (progressBarLarge && progressFillLarge) {
            progressBarLarge.addEventListener('click', function(e) {
                const progress = (e.offsetX / this.offsetWidth) * 100;
                currentProgress = progress;
                currentTime = (progress / 100) * totalTime;
                updatePlayerUI();
                // 更新播放页面UI
                if (currentTimeLargeEl) currentTimeLargeEl.textContent = formatTime(currentTime);
                progressFillLarge.style.width = currentProgress + '%';

                // 发送进度更新事件
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'progress_update',
                        progress: currentProgress,
                        time: currentTime,
                        userId: currentUser.id
                    }));
                }
            });
        }

        // 章节列表交互
        if (chapterItems.length > 0) {
            chapterItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    // 移除所有章节的active类
                    chapterItems.forEach(chapter => chapter.classList.remove('active'));
                    // 添加当前章节的active类

                    item.classList.add('active');

                    // 重置播放进度
                    currentProgress = 0;
                    currentTime = 0;
                    updatePlayerUI();
                    // 更新播放页面UI
                    if (currentTimeLargeEl) currentTimeLargeEl.textContent = formatTime(currentTime);
                    if (progressFillLarge) progressFillLarge.style.width = currentProgress + '%';

                    console.log(`切换到章节 ${index + 1}`);

                    // 发送章节切换事件
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({
                            type: 'change_chapter',
                            chapterIndex: index,
                            userId: currentUser.id
                        }));
                    }
                });
            });
        }

        // 推荐项目交互
        if (recommendItems.length > 0) {
            recommendItems.forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    // 如果点击的是播放按钮，不阻止冒泡
                    if (e.target.closest('.play-now-btn')) {
                        return;
                    }

                    const title = item.querySelector('.recommend-title');
                    const artist = item.querySelector('.recommend-artist');

                    console.log(`选择推荐内容: ${title?.textContent} - ${artist?.textContent}`);
                });
            });
        }

        // 立即播放按钮

        if (playNowBtns.length > 0) {
            playNowBtns.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止冒泡

                    const item = btn.closest('.recommend-item');
                    const title = item.querySelector('.recommend-title');
                    const artist = item.querySelector('.recommend-artist');

                    console.log(`播放推荐内容: ${title?.textContent} - ${artist?.textContent}`);

                    // 开始播放
                    if (!isPlaying) {
                        const playBtn = document.querySelector('.play-btn');
                        playBtn.click();
                        if (playBtnLarge) {
                            playBtnLarge.click();
                        }
                    }

                    // 重置播放进度
                    currentProgress = 0;
                    currentTime = 0;
                    updatePlayerUI();
                    // 更新播放页面UI
                    if (currentTimeLargeEl) currentTimeLargeEl.textContent = formatTime(currentTime);
                    if (progressFillLarge) progressFillLarge.style.width = currentProgress + '%';

                    // 发送播放推荐内容事件
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({
                            type: 'play_recommendation',
                            title: title?.textContent,
                            artist: artist?.textContent,
                            userId: currentUser.id
                        }));
                    }
                });
            });
        }

        // 返回按钮
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('返回上一页');
                // 在实际项目中，这里可以实现返回上一页或关闭侧边栏的功能
            });
        }
    }
}

// 初始化WebSocket连接
function initWebSocket() {
    // 实际项目中替换为你的WebSocket服务器地址
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUri = `${wsProtocol}//${window.location.host}/ws/live`;

    try {
        ws = new WebSocket(wsUri);

        if (ws) {
            ws.onopen = function() {
                console.log('WebSocket连接已建立');
                // 发送加入直播间事件
                ws.send(JSON.stringify({
                    type: 'join_live',
                    userId: currentUser.id,
                    timestamp: new Date().getTime()
                }));
            };

            ws.onmessage = function(event) {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            };

            ws.onclose = function() {
                console.log('WebSocket连接已关闭');
                // 尝试重连
                setTimeout(initWebSocket, 3000);
            };

            ws.onerror = function(error) {
                console.error('WebSocket错误:', error);
            };
        }
    } catch (error) {
        console.error('初始化WebSocket连接失败:', error);
    }
}

// 初始化PK系统
function initPKSystem() {
    // 确保所有元素都存在后再初始化PK系统
    const inviteBtn = document.getElementById('invite-btn');
    const acceptBtn = document.getElementById('accept-btn');
    const rejectBtn = document.getElementById('reject-btn');

    // 连麦邀请 - 只有在元素存在时才添加事件监听器
    if (inviteBtn) {
        inviteBtn.addEventListener('click', () => {
            const targetUserId = prompt('请输入要邀请连麦的用户ID:');
            if (targetUserId && ws) {
                ws.send(JSON.stringify({
                    type: 'invite_pk',
                    from: currentUser.id,
                    to: targetUserId,
                    timestamp: new Date().getTime()
                }));
            }
        });
    }



    // 接受连麦 - 只有在元素存在时才添加事件监听器
    if (acceptBtn) {
        acceptBtn.onclick = function() {
            const pkRequest = JSON.parse(acceptBtn.dataset.request);
            if (ws) {
                ws.send(JSON.stringify({
                    type: 'pk_response',
                    from: currentUser.id,
                    to: pkRequest.from,
                    accepted: true
                }));
            }
            startPK(pkRequest.from);
            acceptBtn.style.display = 'none';
            if (rejectBtn) {
                rejectBtn.style.display = 'none';
            }
        };
    }

    // 拒绝连麦 - 只有在元素存在时才添加事件监听器
    if (rejectBtn) {
        rejectBtn.onclick = function() {
            const pkRequest = JSON.parse(rejectBtn.dataset.request);
            if (ws) {
                ws.send(JSON.stringify({
                    type: 'pk_response',
                    from: currentUser.id,
                    to: pkRequest.from,
                    accepted: false
                }));
            }
            if (acceptBtn) {
                acceptBtn.style.display = 'none';
            }
            rejectBtn.style.display = 'none';
        };
    };
}

// 处理WebSocket消息
function handleWebSocketMessage(data) {
    switch(data.type) {
        case 'invite_pk':
            if (data.to === currentUser.id) {
                // 显示接受/拒绝按钮 - 只有在元素存在时才操作
                const acceptBtn = document.getElementById('accept-btn');
                const rejectBtn = document.getElementById('reject-btn');

                if (acceptBtn && rejectBtn) {
                    acceptBtn.style.display = 'block';
                    rejectBtn.style.display = 'block';
                    acceptBtn.dataset.request = JSON.stringify(data);
                    rejectBtn.dataset.request = JSON.stringify(data);

                    // 显示邀请提示
                    showNotification(`收到来自${data.from}的连麦邀请`);
                }
            }
            break;

        case 'pk_started':
            // 对方已接受PK请求，开始PK
            if (data.opponentId === currentUser.id || data.hostId === currentUser.id) {
                startPK(data.opponentId === currentUser.id ? data.hostId : data.opponentId);
            }
            break;

        case 'stats_update':
            // 更新统计数据
            Object.assign(stats, data.stats);
            updateStatsUI();
            break;

        case 'like':
            // 处理点赞
            stats.likes++;
            updateStatsUI();
            showLikeAnimation(data.userId);
            break;

        case 'gift':
            // 处理礼物
            stats.gifts++;
            stats.revenue += parseInt(data.giftPrice || 0);
            updateStatsUI();
            showGiftAnimation(data);
            break;

        case 'comment':
            // 处理评论
            stats.comments++;
            updateStatsUI();
            addMessageToChat(data);
            break;

        case 'user_joined':
            // 新用户加入
            stats.viewers++;
            updateStatsUI();
            showNotification(`${data.userId}加入了直播间`);
            addViewer(data.userId);
            break;

        case 'user_left':
            // 用户离开
            if (stats.viewers > 0) stats.viewers--;
            updateStatsUI();
            removeViewer(data.userId);
            break;

        case 'pk_score':
            // 更新PK分数
            updatePKScore(data);
            break;
    }
}

// 开始PK
function startPK(opponentId) {
    // 先移除已有的PK容器
    const existingPK = document.querySelector('.pk-container');
    if (existingPK) {
        existingPK.remove();
    }

    // 创建PK界面
    const pkContainer = document.createElement('div');
    pkContainer.className = 'pk-container';
    pkContainer.innerHTML = `
        <div class="pk-player host">
            <video id="host-video" autoplay muted></video>
            <div class="pk-stats">
                <div class="pk-score">0</div>
                <div class="pk-gifts">0</div>
            </div>
            <div class="pk-username">${currentUser.id}</div>
        </div>
        <div class="pk-vs">VS</div>
        <div class="pk-player opponent">
            <video id="opponent-video" autoplay></video>
            <div class="pk-stats">
                <div class="pk-score">0</div>
                <div class="pk-gifts">0</div>
            </div>
            <div class="pk-username">${opponentId}</div>
        </div>
        <div class="pk-timer">60</div>
        <button class="pk-end-btn">结束PK</button>
    `;
    document.body.appendChild(pkContainer);

    // 结束PK按钮事件
    pkContainer.querySelector('.pk-end-btn').addEventListener('click', endPK);

    // 初始化WebRTC连接
    initWebRTC(opponentId);

    // 开始计时
    startPKTimer(pkContainer.querySelector('.pk-timer'));

    // 通知服务器PK已开始
    ws.send(JSON.stringify({
        type: 'pk_started',
        hostId: currentUser.id,
        opponentId: opponentId,
        timestamp: new Date().getTime()
    }));
}

// 初始化WebRTC连接
function initWebRTC(opponentId) {
    // 实际项目中需要实现完整的WebRTC逻辑
    const hostVideo = document.getElementById('host-video');
    const opponentVideo = document.getElementById('opponent-video');

    // 模拟获取本地媒体流
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            hostVideo.srcObject = stream;

            // 在实际项目中，这里需要通过信令服务器交换ICE候选者和SDP信息
            // 这里仅做模拟
            setTimeout(() => {
                // 模拟远程流
                opponentVideo.srcObject = stream.clone();
            }, 1000);
        })
        .catch(error => {
            console.error('获取媒体流失败:', error);
            alert('无法访问摄像头/麦克风，请确保已授予权限');
        });
}

// 开始PK计时器
function startPKTimer(timerElement) {
    let seconds = 60;

    // 清除之前的计时器
    if (pkTimer) {
        clearInterval(pkTimer);
    }

    timerElement.textContent = seconds;

    pkTimer = setInterval(() => {
        seconds--;
        timerElement.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(pkTimer);
            endPK();
        }
    }, 1000);
}

// 结束PK
function endPK() {
    if (pkTimer) {
        clearInterval(pkTimer);
        pkTimer = null;
    }

    const pkContainer = document.querySelector('.pk-container');
    if (pkContainer) {
        // 获取最终分数
        const hostScore = parseInt(pkContainer.querySelector('.host .pk-score').textContent);
        const opponentScore = parseInt(pkContainer.querySelector('.opponent .pk-score').textContent);

        // 显示结果
        let resultText = hostScore > opponentScore ? '你赢了！' :
                        hostScore < opponentScore ? '你输了！' : '平局！';

        pkContainer.innerHTML = `
            <div class="pk-result">
                <h2>PK结束</h2>
                <p>${resultText}</p>
                <div class="pk-final-score">
                    <span>${hostScore}</span> : <span>${opponentScore}</span>
                </div>
                <button class="pk-close-btn">关闭</button>
            </div>
        `;

        // 关闭按钮事件
        pkContainer.querySelector('.pk-close-btn').addEventListener('click', () => {
            pkContainer.remove();
        });

        // 通知服务器PK已结束
        ws.send(JSON.stringify({
            type: 'pk_ended',
            hostId: currentUser.id,
            opponentId: document.querySelector('.opponent .pk-username').textContent,
            hostScore: hostScore,
            opponentScore: opponentScore,
            timestamp: new Date().getTime()
        }));
    }
}

// 更新PK分数
function updatePKScore(data) {
    const pkContainer = document.querySelector('.pk-container');
    if (!pkContainer) return;

    if (data.userId === currentUser.id) {
        const hostScoreEl = pkContainer.querySelector('.host .pk-score');
        hostScoreEl.textContent = data.score;
        hostScoreEl.classList.add('score-update');
        setTimeout(() => hostScoreEl.classList.remove('score-update'), 500);
    } else {
        const opponentScoreEl = pkContainer.querySelector('.opponent .pk-score');
        opponentScoreEl.textContent = data.score;
        opponentScoreEl.classList.add('score-update');
        setTimeout(() => opponentScoreEl.classList.remove('score-update'), 500);
    }
}

// 初始化统计系统
function initStatsSystem() {
    // 更新统计数据的UI
    function updateStatsUI() {
        if (document.getElementById('viewer-count')) {
            document.getElementById('viewer-count').textContent = stats.viewers;
        }
        if (document.getElementById('like-count')) {
            document.getElementById('like-count').textContent = stats.likes;
        }
        if (document.getElementById('gift-count')) {
            document.getElementById('gift-count').textContent = stats.gifts;
        }
        if (document.getElementById('comment-count')) {
            document.getElementById('comment-count').textContent = stats.comments;
        }
        if (document.getElementById('duration')) {
            document.getElementById('duration').textContent = formatDuration(stats.duration);
        }
        if (document.getElementById('revenue')) {
            document.getElementById('revenue').textContent = stats.revenue;
        }
    }

    // 直播时长计时器
    setInterval(() => {
        stats.duration++;
        updateStatsUI();
    }, 1000);

    // 定期从服务器同步完整数据
    setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'request_stats'
            }));
        }
    }, 5000);

    // 点赞按钮功能
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'like',
                    userId: currentUser.id,
                    timestamp: new Date().getTime()
                }));
            }
        });
    }

    // 礼物按钮功能
    const giftBtns = document.querySelectorAll('.gift-btn');
    giftBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const giftId = btn.dataset.giftId;
            const giftPrice = btn.dataset.giftPrice;
            const giftName = btn.dataset.giftName;

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'gift',
                    userId: currentUser.id,
                    giftId: giftId,
                    giftName: giftName,
                    giftPrice: giftPrice,
                    timestamp: new Date().getTime()
                }));
            }
        });
    });

    // 聊天发送功能
    const chatSendBtn = document.querySelector('.chat-input button');
    const chatInput = document.querySelector('.chat-input input');

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

// 发送聊天消息
function sendChatMessage() {
    const chatInput = document.querySelector('.chat-input input');
    const message = chatInput.value.trim();

    if (message && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'comment',
            userId: currentUser.id,
            content: message,
            timestamp: new Date().getTime()
        }));

        // 清空输入框
        chatInput.value = '';
    }
}

// 添加消息到聊天界面
function addMessageToChat(data) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message ${data.userId === currentUser.id ? 'host' : 'student'}`;

    const date = new Date(data.timestamp);
    const timeStr = `${date.getFullYear()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    messageEl.innerHTML = `
        <div class="message-sender">${data.userId}</div>
        <div class="message-content">${data.content}</div>
        <div class="message-time">${timeStr}</div>
    `;

    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 滚动到底部
}

// 显示点赞动画
function showLikeAnimation(userId) {
    const likeAnimation = document.createElement('div');
    likeAnimation.className = 'like-animation';
    likeAnimation.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    `;

    // 随机位置
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 60 + 20;

    likeAnimation.style.left = `${x}%`;
    likeAnimation.style.top = `${y}%`;

    document.body.appendChild(likeAnimation);

    // 动画结束后移除
    setTimeout(() => {
        likeAnimation.remove();
    }, 1500);
}

// 显示礼物动画
function showGiftAnimation(data) {
    const giftAnimation = document.createElement('div');
    giftAnimation.className = 'gift-animation';
    giftAnimation.innerHTML = `
        <div class="gift-icon">🎁</div>
        <div class="gift-info">
            <span class="gift-sender">${data.userId}</span>
            <span class="gift-name">赠送了${data.giftName}</span>
        </div>
    `;

    document.body.appendChild(giftAnimation);

    // 动画结束后移除
    setTimeout(() => {
        giftAnimation.remove();
    }, 3000);
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    // 3秒后自动消失
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// 添加观众到列表
function addViewer(userId) {
    const viewersList = document.querySelector('.viewers-list');
    if (!viewersList) return;

    // 检查是否已存在
    if (document.querySelector(`.viewer-item[data-user="${userId}"]`)) {
        return;
    }

    const viewerEl = document.createElement('div');
    viewerEl.className = 'viewer-item';
    viewerEl.dataset.user = userId;
    viewerEl.innerHTML = `
        <div class="viewer-info">
            <div class="viewer-avatar"></div>
            <div class="viewer-name">${userId}</div>
        </div>
        <button class="manage-btn">管理</button>
    `;

    viewersList.appendChild(viewerEl);
}

// 从列表移除观众
function removeViewer(userId) {
    const viewerEl = document.querySelector(`.viewer-item[data-user="${userId}"]`);
    if (viewerEl) {
        viewerEl.remove();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initWebSocket();
    initPlayerPage();
    // 只有在直播页面或有PK相关元素的页面才初始化PK系统
    const currentUrl = window.location.href;
    if (currentUrl.includes('live.html') || document.getElementById('invite-btn') || document.getElementById('accept-btn') || document.getElementById('reject-btn')) {
        initPKSystem();
    }
    initStatsSystem();

    // 初始化音频播放器
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.querySelector('.play-btn');
    const speedBtn = document.querySelector('.speed-btn');
    const speedMenu = document.querySelector('.speed-menu');
    const speedOptions = document.querySelectorAll('.speed-option');
    const currentSpeed = document.getElementById('currentSpeed');
    const playlistBtn = document.querySelector('.playlist-btn');
    const playlistPanel = document.querySelector('.playlist-panel');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeEl = document.querySelector('.time.current');

    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', () => {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            const minutes = Math.floor(audioPlayer.currentTime / 60);
            const seconds = Math.floor(audioPlayer.currentTime % 60);
            if (currentTimeEl) {
                currentTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (audioPlayer) {
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    playBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                    `;
                } else {
                    audioPlayer.pause();
                    playBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    `;
                }
            }
        });
    }

    if (speedBtn && speedMenu) {
        speedBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speedMenu.classList.toggle('active');
        });
    }

    speedOptions.forEach(option => {
        option.addEventListener('click', () => {
            const speed = parseFloat(option.dataset.speed);
            if (audioPlayer) {
                audioPlayer.playbackRate = speed;
            }
            if (currentSpeed) {
                currentSpeed.textContent = `${speed}x`;
            }
            if (speedMenu) {
                speedMenu.classList.remove('active');
            }
        });
    });

    if (playlistBtn && playlistPanel) {
        playlistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playlistPanel.classList.toggle('active');
        });
    }

    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            playlistItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    document.addEventListener('click', () => {
        if (speedMenu) speedMenu.classList.remove('active');
        if (playlistPanel) playlistPanel.classList.remove('active');
    });
});