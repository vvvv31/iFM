// 播放器功能模块
class AudioPlayer {
    constructor() {
        this.audioElement = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.currentAudioId = null;
        this.volume = 0.8;
        this.playbackRate = 1.0;
        this.currentAudioData = null;
        this.init();
    }

    init() {
        this.createAudioElement();
        this.bindPlayerEvents();
        this.setupGlobalEventListeners();
    }

    createAudioElement() {
        this.audioElement = document.createElement('audio');
        this.audioElement.volume = this.volume;
        this.audioElement.playbackRate = this.playbackRate;
        document.body.appendChild(this.audioElement);
    }

    bindPlayerEvents() {
        // 音频事件监听
        this.audioElement.addEventListener('loadedmetadata', () => {
            this.duration = this.audioElement.duration;
            this.updateDurationDisplay();
        });

        this.audioElement.addEventListener('timeupdate', () => {
            this.currentTime = this.audioElement.currentTime;
            this.updateProgress();
            this.updateTimeDisplay();
        });

        this.audioElement.addEventListener('ended', () => {
            this.handleAudioEnd();
        });

        this.audioElement.addEventListener('error', (e) => {
            console.error('音频加载错误:', e);
            this.showNotification('音频加载失败，请检查网络连接');
        });
    }

    setupGlobalEventListeners() {
        // 全局播放器事件委托
        document.addEventListener('click', (e) => {
            if (e.target.closest('.play-pause-btn')) {
                this.togglePlayPause();
            } else if (e.target.closest('.prev-btn')) {
                this.previousTrack();
            } else if (e.target.closest('.next-btn')) {
                this.nextTrack();
            } else if (e.target.closest('.backward-btn')) {
                this.seekBackward();
            } else if (e.target.closest('.forward-btn')) {
                this.seekForward();
            } else if (e.target.closest('.like-btn')) {
                this.toggleLike();
            } else if (e.target.closest('.download-btn')) {
                this.downloadAudio();
            } else if (e.target.closest('.share-btn')) {
                this.shareAudio();
            } else if (e.target.closest('.playlist-btn')) {
                this.addToPlaylist();
            } else if (e.target.closest('.settings-btn')) {
                this.showSettings();
            }
        });

        // 进度条点击事件
        document.addEventListener('click', (e) => {
            const progressBar = e.target.closest('.progress-bar');
            if (progressBar) {
                this.handleProgressClick(e, progressBar);
            }
        });

        // 播放速度控制
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('playback-rate-select')) {
                this.changePlaybackRate(parseFloat(e.target.value));
            }
        });

        // 音量控制
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('volume-slider')) {
                this.setVolume(parseFloat(e.target.value));
            }
        });

        // 评论提交
        document.addEventListener('click', (e) => {
            if (e.target.closest('.comment-submit-btn')) {
                this.submitComment();
            }
        });
    }

    loadAudio(audioId) {
        this.currentAudioId = audioId;
        this.currentAudioData = this.getAudioData(audioId);
        
        // 模拟音频加载
        console.log('加载音频:', this.currentAudioData.title);
        
        // 更新播放器界面
        this.updatePlayerInterface(this.currentAudioData);
        
        // 自动开始播放
        setTimeout(() => {
            this.play();
        }, 500);
    }

    updatePlayerInterface(audioData) {
        // 更新播放器显示信息
        const playerElements = document.querySelectorAll('.player-info h2');
        playerElements.forEach(el => {
            el.textContent = audioData.title;
        });

        const creatorElements = document.querySelectorAll('.player-info p');
        creatorElements.forEach(el => {
            el.textContent = `${audioData.creator} · 更新于${this.formatTimeAgo(audioData.updateTime)}`;
        });

        // 更新封面
        const coverElements = document.querySelectorAll('.player-cover, .mini-cover');
        coverElements.forEach(el => {
            el.innerHTML = `<i class="${audioData.icon || 'fas fa-headphones'}"></i>`;
            if (audioData.color) {
                el.style.background = audioData.color;
            }
        });

        // 更新迷你播放器信息
        const miniInfoElements = document.querySelectorAll('.mini-info h4, .mini-info p');
        if (miniInfoElements[0]) miniInfoElements[0].textContent = audioData.title;
        if (miniInfoElements[1]) miniInfoElements[1].textContent = audioData.creator;

        // 更新评论列表
        this.updateComments(audioData.comments);
    }

    updateComments(comments) {
        const commentsContainer = document.querySelector('.comments-list');
        if (!commentsContainer) return;

        commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-avatar" style="background: ${comment.avatarColor || '#4fc3f7'};"></div>
                <div class="comment-content">
                    <h4>${comment.author}</h4>
                    <p>${comment.content}</p>
                    <div class="comment-time">${this.formatTimeAgo(comment.timestamp)}</div>
                    <div class="comment-actions">
                        <button class="comment-like-btn" data-comment-id="${comment.id}">
                            <i class="far fa-heart"></i> ${comment.likes}
                        </button>
                        <button class="comment-reply-btn">回复</button>
                    </div>
                </div>
            </div>
        `).join('');

        // 绑定评论互动事件
        this.bindCommentEvents();
    }

    bindCommentEvents() {
        document.querySelectorAll('.comment-like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.likeComment(e.target.closest('.comment-like-btn'));
            });
        });

        document.querySelectorAll('.comment-reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.replyToComment(e.target.closest('.comment-reply-btn'));
            });
        });
    }

    likeComment(button) {
        const icon = button.querySelector('i');
        const currentLikes = parseInt(button.textContent.match(/\d+/)[0]);
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'var(--error)';
            button.innerHTML = `<i class="fas fa-heart"></i> ${currentLikes + 1}`;
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
            button.innerHTML = `<i class="far fa-heart"></i> ${currentLikes - 1}`;
        }
    }

    replyToComment(button) {
        const comment = button.closest('.comment');
        const author = comment.querySelector('h4').textContent;
        
        const replyInput = document.querySelector('.comment-input');
        if (replyInput) {
            replyInput.value = `@${author} `;
            replyInput.focus();
        }
    }

    submitComment() {
        const commentInput = document.querySelector('.comment-input');
        if (!commentInput || !commentInput.value.trim()) return;

        const newComment = {
            id: Date.now(),
            author: '我',
            content: commentInput.value,
            timestamp: new Date(),
            likes: 0,
            avatarColor: '#ffc107'
        };

        // 添加到评论列表
        const commentsContainer = document.querySelector('.comments-list');
        if (commentsContainer) {
            const commentHTML = `
                <div class="comment">
                    <div class="comment-avatar" style="background: ${newComment.avatarColor};"></div>
                    <div class="comment-content">
                        <h4>${newComment.author}</h4>
                        <p>${newComment.content}</p>
                        <div class="comment-time">刚刚</div>
                        <div class="comment-actions">
                            <button class="comment-like-btn" data-comment-id="${newComment.id}">
                                <i class="far fa-heart"></i> ${newComment.likes}
                            </button>
                            <button class="comment-reply-btn">回复</button>
                        </div>
                    </div>
                </div>
            `;
            commentsContainer.insertAdjacentHTML('afterbegin', commentHTML);
        }

        commentInput.value = '';
        this.showNotification('评论发布成功');

        // 重新绑定事件
        this.bindCommentEvents();
    }

    play() {
        if (this.audioElement) {
            // 模拟播放
            this.isPlaying = true;
            this.updatePlayButton();
            this.startProgressSimulation();
            this.showNotification('开始播放: ' + (this.currentAudioData?.title || ''));
        }
    }

    pause() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.stopProgressSimulation();
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    startProgressSimulation() {
        if (this.progressInterval) clearInterval(this.progressInterval);
        
        this.progressInterval = setInterval(() => {
            if (this.isPlaying && this.currentTime < this.duration) {
                this.currentTime += 1;
                this.updateProgress();
                this.updateTimeDisplay();
                
                if (this.currentTime >= this.duration) {
                    this.handleAudioEnd();
                }
            }
        }, 1000);
    }

    stopProgressSimulation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    seekTo(time) {
        this.currentTime = Math.max(0, Math.min(this.duration, time));
        this.updateProgress();
        this.updateTimeDisplay();
    }

    seekBackward() {
        this.seekTo(this.currentTime - 10);
    }

    seekForward() {
        this.seekTo(this.currentTime + 10);
    }

    previousTrack() {
        this.showNotification('上一首');
        // 这里可以添加实际的上一首逻辑
    }

    nextTrack() {
        this.showNotification('下一首');
        // 这里可以添加实际的下一首逻辑
    }

    updateProgress() {
        const progress = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
        
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            bar.style.width = `${progress}%`;
        });
    }

    updateTimeDisplay() {
        const timeElements = document.querySelectorAll('.progress-time');
        timeElements.forEach(element => {
            const spans = element.querySelectorAll('span');
            if (spans[0]) spans[0].textContent = this.formatTime(this.currentTime);
            if (spans[1]) spans[1].textContent = this.formatTime(this.duration);
        });
    }

    updateDurationDisplay() {
        this.updateTimeDisplay();
    }

    updatePlayButton() {
        const playButtons = document.querySelectorAll('.play-pause-btn i');
        playButtons.forEach(icon => {
            if (this.isPlaying) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    handleProgressClick(event, progressBar) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        const newTime = percent * this.duration;
        
        this.seekTo(newTime);
    }

    handleAudioEnd() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.updatePlayButton();
        this.updateProgress();
        this.stopProgressSimulation();
        this.showNotification('播放结束');
    }

    changePlaybackRate(rate) {
        this.playbackRate = rate;
        this.showNotification(`播放速度: ${rate}x`);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        const volumeIcons = document.querySelectorAll('.volume-control i');
        volumeIcons.forEach(icon => {
            if (this.volume === 0) {
                icon.className = 'fas fa-volume-mute';
            } else if (this.volume < 0.5) {
                icon.className = 'fas fa-volume-down';
            } else {
                icon.className = 'fas fa-volume-up';
            }
        });
    }

    toggleLike() {
        const likeButtons = document.querySelectorAll('.like-btn i');
        likeButtons.forEach(icon => {
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = 'var(--error)';
                this.showNotification('已添加到收藏');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                this.showNotification('已从收藏移除');
            }
        });
    }

    downloadAudio() {
        this.showNotification('开始下载音频...');
        // 模拟下载
        setTimeout(() => {
            this.showNotification('下载完成');
        }, 2000);
    }

    shareAudio() {
        this.showNotification('分享功能开发中...');
    }

    addToPlaylist() {
        this.showNotification('已添加到播放列表');
    }

    showSettings() {
        this.showNotification('设置功能开发中...');
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return '刚刚';
        if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
        return `${Math.floor(diffInMinutes / 1440)}天前`;
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

    // 模拟音频数据
    getAudioData(audioId) {
        const audioLibrary = {
            1: {
                id: 1,
                title: "深夜星空电台：孤独与陪伴",
                creator: "星空主播小雅",
                duration: 1690,
                color: "linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)",
                icon: "fas fa-headphones",
                updateTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                comments: [
                    {
                        id: 1,
                        author: "星空旅人",
                        content: "每次睡前听小雅的声音都觉得特别安心，就像有个人在身边陪伴一样。",
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        likes: 12,
                        avatarColor: "#4fc3f7"
                    },
                    {
                        id: 2,
                        author: "夜行侠",
                        content: "今天的话题真的很戳中我，有时候在城市里确实会感到孤独，感谢这个节目。",
                        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                        likes: 8,
                        avatarColor: "#81c784"
                    },
                    {
                        id: 3,
                        author: "星辰大海",
                        content: "可以点播明天的内容吗？想听关于友情的话题。",
                        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                        likes: 5,
                        avatarColor: "#ffb74d"
                    }
                ]
            },
            2: {
                id: 2,
                title: "文学星空：经典短篇小说赏析",
                creator: "文心老师",
                duration: 2580,
                color: "linear-gradient(135deg, #f48fb1 0%, #d81b60 100%)",
                icon: "fas fa-book-open",
                updateTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
                comments: [
                    {
                        id: 4,
                        author: "书虫",
                        content: "老师分析得很透彻，让我对这篇小说有了新的理解。",
                        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                        likes: 6,
                        avatarColor: "#7986cb"
                    }
                ]
            },
            3: {
                id: 3,
                title: "英语星空：地道表达每日一句",
                creator: "英语小助手",
                duration: 720,
                color: "linear-gradient(135deg, #81c784 0%, #388e3c 100%)",
                icon: "fas fa-language",
                updateTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
                comments: [
                    {
                        id: 5,
                        author: "学习者",
                        content: "这个表达很实用，已经记在小本本上了！",
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        likes: 3,
                        avatarColor: "#4db6ac"
                    }
                ]
            }
        };
        
        return audioLibrary[audioId] || audioLibrary[1];
    }
}

// 初始化播放器
let audioPlayer = null;

document.addEventListener('DOMContentLoaded', () => {
    audioPlayer = new AudioPlayer();
    
    if (window.app) {
        window.app.audioPlayer = audioPlayer;
    }
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .comment-actions {
        display: flex;
        gap: 15px;
        margin-top: 8px;
    }
    
    .comment-like-btn, .comment-reply-btn {
        background: none;
        border: none;
        color: #666;
        font-size: 12px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .comment-like-btn:hover, .comment-reply-btn:hover {
        color: var(--primary-blue);
    }
    
    .comment-input-container {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    .comment-input {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        font-size: 14px;
    }
    
    .comment-submit-btn {
        padding: 10px 20px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
    }
`;
document.head.appendChild(style);