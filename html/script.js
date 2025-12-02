// 导航菜单交互
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        // 移除所有active状态
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        // 添加当前项active状态
        item.classList.add('active');
        // 这里可以添加页面跳转逻辑
    });
});

// 搜索框功能
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        console.log('搜索关键词:', searchTerm);
        // 这里可以添加实际的搜索逻辑
        alert(`搜索: ${searchTerm}`);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// 用户菜单交互
const userMenuLinks = document.querySelectorAll('.user-menu-link');
userMenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (!link.classList.contains('btn-pink')) {
            e.preventDefault();
            console.log('用户菜单点击:', link.textContent.trim());
            // 这里可以添加用户菜单的具体功能
        }
    });
});

// 投稿按钮特殊处理
const submitBtn = document.querySelector('.btn-pink');
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('点击投稿按钮');
    alert('投稿功能即将上线！');
});

// 每日一句复制功能
const copyBtn = document.querySelector('.copy-btn');
copyBtn.addEventListener('click', () => {
    const quoteText = '每日一句：享受生活的美好瞬间。';
    navigator.clipboard.writeText(quoteText).then(() => {
        alert('已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
    });
});

// 频道卡片交互
const channelItems = document.querySelectorAll('.channel-item');
channelItems.forEach(channel => {
    channel.addEventListener('click', () => {
        console.log('点击频道:', channel.textContent.trim());
        alert(`进入频道: ${channel.textContent.trim()}`);
    });
});

// 推荐区域点击交互
const largeRecommend = document.querySelector('.large-recommend');
const smallRecommends = document.querySelectorAll('.small-recommend');

largeRecommend.addEventListener('click', () => {
    alert('进入推荐内容详情');
});

smallRecommends.forEach((recommend, index) => {
    recommend.addEventListener('click', () => {
        alert(`进入推荐内容${index + 1}详情`);
    });
});

// 排行榜样式点击交互
const rankItems = document.querySelectorAll('.rank-item');
rankItems.forEach((rank, index) => {
    rank.addEventListener('click', () => {
        const rankNames = ['热度榜', '收藏榜', '在线榜'];
        alert(`查看${rankNames[index]}`);
    });
});

// 播放器控制功能
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const volumeBar = document.querySelector('.volume-bar');
const volumeFill = document.querySelector('.volume-fill');
const volumeBtn = document.querySelector('.volume-btn');

// 模拟音频对象
let isPlaying = false;
let currentVolume = 70; // 初始音量70%
let currentProgress = 30; // 初始进度30%
let currentTime = 120; // 当前时间（秒）
let totalTime = 400; // 总时长（秒）

// 格式化时间函数
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// 更新播放器UI
function updatePlayerUI() {
    // 更新播放按钮图标
    const playIcon = playBtn.querySelector('svg');
    if (playIcon) {
        // 这里实际项目中应该替换SVG图标，这里简单模拟
        if (isPlaying) {
            playBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
            `;
        } else {
            playBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            `;
        }
    }
    
    // 更新进度条
    progressFill.style.width = currentProgress + '%';
    
    // 更新时间显示
    currentTimeEl.textContent = formatTime(currentTime);
    totalTimeEl.textContent = formatTime(totalTime);
    
    // 更新音量条
    volumeFill.style.width = currentVolume + '%';
}

// 初始化播放器
function initPlayer() {
    updatePlayerUI();
    
    // 播放/暂停功能
    playBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        updatePlayerUI();
        console.log(isPlaying ? '开始播放' : '暂停播放');
    });
    
    // 上一首功能
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            console.log('上一首');
            // 重置进度
            currentProgress = 0;
            currentTime = 0;
            updatePlayerUI();
        });
    }
    
    // 下一首功能
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log('下一首');
            // 重置进度
            currentProgress = 0;
            currentTime = 0;
            updatePlayerUI();
        });
    }
    
    // 进度条拖动功能
    progressBar.addEventListener('click', function(e) {
        const progress = (e.offsetX / this.offsetWidth) * 100;
        currentProgress = progress;
        currentTime = (progress / 100) * totalTime;
        updatePlayerUI();
    });
    
    // 音量控制功能
    volumeBar.addEventListener('click', function(e) {
        const volume = (e.offsetX / this.offsetWidth) * 100;
        currentVolume = volume;
        updatePlayerUI();
    });
    
    // 静音功能
    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            const volumeIcon = this.querySelector('svg');
            if (currentVolume > 0) {
                // 静音
                this.dataset.previousVolume = currentVolume;
                currentVolume = 0;
            } else {
                // 恢复之前的音量
                currentVolume = this.dataset.previousVolume || 70;
            }
            updatePlayerUI();
        });
    }
    
    // 模拟播放进度更新
    let interval;
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            interval = setInterval(() => {
                if (currentTime < totalTime) {
                    currentTime += 1;
                    currentProgress = (currentTime / totalTime) * 100;
                    updatePlayerUI();
                } else {
                    // 播放结束，模拟自动播放下一首
                    clearInterval(interval);
                    if (nextBtn) {
                        nextBtn.click();
                        playBtn.click();
                    }
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
    });
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

// 初始化函数
function initAll() {
    console.log('页面加载完成');
    initPlayer();
    initPlayerPage();
    
    // 添加播放进度实时更新（同时更新主页和播放页面）
    let interval;
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            interval = setInterval(() => {
                if (currentTime < totalTime) {
                    currentTime += 1;
                    currentProgress = (currentTime / totalTime) * 100;
                    updatePlayerUI();
                    
                    // 同步更新播放页面
                    const currentTimeLargeEl = document.querySelector('.current-time-large');
                    const progressFillLarge = document.querySelector('.progress-fill-large');
                    if (currentTimeLargeEl) currentTimeLargeEl.textContent = formatTime(currentTime);
                    if (progressFillLarge) progressFillLarge.style.width = currentProgress + '%';
                } else {
                    // 播放结束，模拟自动播放下一首
                    clearInterval(interval);
                    if (nextBtn) {
                        nextBtn.click();
                        playBtn.click();
                    }
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
    });
}

// 初始化所有功能
window.addEventListener('DOMContentLoaded', initAll);
