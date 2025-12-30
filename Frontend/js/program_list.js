/**
 * 节目详情页核心逻辑
 * 功能：1. 解析URL中的节目ID 2. 加载对应节目数据 3. 渲染页面内容
 */
document.addEventListener('DOMContentLoaded', function() {
    // -------------------------- 配置与回退数据 --------------------------
    const API_BASE = (window.__API_BASE__ !== undefined && window.__API_BASE__) ? window.__API_BASE__ : 'http://localhost:8080';

    // 回退示例数据（当无法请求后端时使用）
    const programData = [
        {
            id: 1,
            title: "商务英语会话技巧",
            teacher: "李老师",
            cover: "https://via.placeholder.com/300x200?text=商务英语", // 占位图，实际替换为真实封面
            level: "中级",
            episodes: 22,
            status: "已完结",
            playCount: 102000,
            rating: 4.8,
            learnCount: 48000,
            desc: "职场英语技巧与商务沟通：本课程专注于职场商务英语，涵盖商务沟通、会议、谈判、邮件写作等实用技能，帮助学习者在职场中自如运用英语。",
            goals: [
                "掌握商务沟通基本技巧",
                "能够参与英语商务会议",
                "学会撰写专业商务邮件",
                "提高商务谈判能力",
                "了解国际商务礼仪"
            ],
            chapters: [
                {
                    unit: "第1单元：日常商务对话",
                    lessons: [
                        { id: 101, title: "日常对话-打招呼与自我介绍", duration: "10:35" },
                        { id: 102, title: "日常对话-在餐厅点餐", duration: "8:45" },
                        { id: 103, title: "日常对话-问路与交通", duration: "12:10" },
                        { id: 104, title: "日常对话-购物常用语", duration: "9:30" }
                    ]
                },
                {
                    unit: "第2单元：商务会议技巧",
                    lessons: [
                        { id: 201, title: "会议开场与自我介绍", duration: "11:25" },
                        { id: 202, title: "会议讨论与意见表达", duration: "13:40" },
                        { id: 203, title: "会议总结与后续安排", duration: "9:15" }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "日常英语口语600句",
            teacher: "王老师",
            cover: "https://via.placeholder.com/300x200?text=日常英语",
            level: "初级",
            episodes: 30,
            status: "已完结",
            playCount: 50000,
            rating: 4.7,
            learnCount: 25000,
            desc: "零基础入门日常英语口语，涵盖生活、工作、出行等高频场景，600句实用句型+场景对话，帮助学习者快速开口说英语。",
            goals: [
                "掌握日常高频口语句型",
                "能够应对生活场景对话",
                "提高英语口语反应速度",
                "积累基础英语词汇"
            ],
            chapters: [
                {
                    unit: "第1单元：日常问候与介绍",
                    lessons: [
                        { id: 301, title: "问候与回应", duration: "7:20" },
                        { id: 302, title: "自我介绍与他人介绍", duration: "8:15" }
                    ]
                }
            ]
        },
        {
            id: 3,
            title: "英语听力进阶训练",
            teacher: "张老师",
            cover: "https://via.placeholder.com/300x200?text=听力训练",
            level: "中高级",
            episodes: 18,
            status: "更新中",
            playCount: 14000,
            rating: 4.9,
            learnCount: 8000,
            desc: "针对英语听力薄弱者设计，从慢速到快速，从短句到长文，系统提升听力理解能力，涵盖新闻、演讲、对话等多种听力材料。",
            goals: [
                "提高英语听力速度适应能力",
                "掌握听力关键词抓取技巧",
                "理解不同口音的英语表达",
                "提升长难句听力理解能力"
            ],
            chapters: [
                {
                    unit: "第1单元：慢速新闻听力",
                    lessons: [
                        { id: 401, title: "新闻入门-环境类话题", duration: "15:30" },
                        { id: 402, title: "新闻入门-科技类话题", duration: "14:20" }
                    ]
                }
            ]
        },
        {
            id: 4,
            title: "深夜英语角", // 与收藏页标题完全一致
            teacher: "刘老师",
            cover: "https://via.placeholder.com/300x200?text=深夜英语角",
            level: "初级",
            episodes: 15,
            status: "已完结",
            playCount: 125000, // 收藏页显示12.5万次
            rating: 5.0,
            learnCount: 68000,
            desc: "深夜英语角，轻松练口语！适合上班族利用碎片时间提升英语口语，涵盖日常对话、话题讨论等场景。",
            goals: [
                "提升日常英语口语流利度",
                "积累高频口语词汇",
                "克服开口恐惧"
            ],
            chapters: [
                {
                    unit: "第1单元：日常话题讨论",
                    lessons: [
                        { id: 501, title: "兴趣爱好交流", duration: "15:20" },
                        { id: 502, title: "职场生活分享", duration: "18:10" }
                    ]
                }
            ]
        },
        {
            id: 5,
            title: "宇宙奥秘", // 与收藏页标题完全一致
            teacher: "赵教授",
            cover: "https://via.placeholder.com/300x200?text=宇宙奥秘",
            level: "通识",
            episodes: 10,
            status: "已完结",
            playCount: 158000, // 收藏页显示15.8万次
            rating: 4.9,
            learnCount: 92000,
            desc: "探索宇宙未知，解读星系、黑洞、外星生命等热门话题，用通俗语言讲解专业天文知识。",
            goals: [
                "了解宇宙基本构成",
                "掌握天文科普常识",
                "激发科学探索兴趣"
            ],
            chapters: [
                {
                    unit: "第1单元：太阳系探秘",
                    lessons: [
                        { id: 601, title: "太阳与八大行星", duration: "22:30" },
                        { id: 602, title: "月球起源与潮汐", duration: "19:45" }
                    ]
                }
            ]
        }
        // 可添加更多节目数据...
    ];

    // -------------------------- 2. 元素获取（根据 program_list.html 的 ID） --------------------------
    const programTitle = document.getElementById('courseTitle');
    const programCover = document.getElementById('courseImage');
    const programEpisodes = document.getElementById('courseEpisodes');
    const programPlayCount = document.getElementById('playCount');
    const programIntroduction = document.getElementById('courseIntroduction');
    const programFAQ = document.getElementById('faqContent');
    // 章节侧边栏
    const sidebarChapters = document.getElementById('chapterList');
    // 标签切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // 操作按钮
    const studyBtn = document.getElementById('studyBtn');
    const collectBtn = document.getElementById('collectBtn');
    const shareBtn = document.getElementById('shareBtn');

    // 全局状态
    let currentProgramId = null;
    let currentUiProgram = null;
    let isCollected = false;


    // -------------------------- 3. 解析URL中的节目ID --------------------------
    function getProgramIdFromUrl() {
        // 从URL中提取?id=xxx参数
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        // 容错处理：若ID不存在或不是数字，返回null
        return id && !isNaN(id) ? parseInt(id) : null;
    }

    // -------------------------- 额外辅助：格式化秒为 mm:ss 或 hh:mm:ss --------------------------
    function formatSeconds(seconds) {
        if (!seconds && seconds !== 0) return '';
        seconds = Number(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const pad = n => String(n).padStart(2, '0');
        if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
        return `${m}:${pad(s)}`;
    }

    // 将后端 program 对象映射为页面 renderProgram 所需结构
    function mapApiProgramToUi(p) {
        const audios = (p.audios || []).map(a => ({
            id: a.audioId || a.id || 0,
            title: a.title || a.name || '未命名音频',
            duration: a.duration ? formatSeconds(a.duration) : (a.durationStr || ''),
            coverUrl: a.coverUrl || ''
        }));

        const episodesCount = audios.length;

        return {
            id: p.programId || p.id || 0,
            title: p.title || '未命名节目',
            cover: p.coverUrl || (audios[0] && audios[0].coverUrl) || 'https://via.placeholder.com/300x200?text=封面',
            episodes: episodesCount,
            playCount: p.playCount || 0,
            desc: p.introduction || p.description || '',
            faq: p.faq || '',
            audios: audios
        };
    }

    // -------------------------- 4. 渲染页面核心函数 --------------------------
    function renderProgram(program) {
        // 1. 渲染基本信息
        programTitle.textContent = program.title;
        programCover.src = program.cover;
        programCover.alt = program.title;

        console.log('renderProgram ->', program);

        // 显示集数（audios 的数量），当为 0 时显示“暂无内容”
        if (program.episodes && program.episodes > 0) {
            if (programEpisodes) {
                programEpisodes.style.display = '';
                programEpisodes.textContent = `${program.episodes}集`;
            }
        } else {
            if (programEpisodes) {
                programEpisodes.style.display = '';
                programEpisodes.textContent = `暂无内容`;
            }
        }

        // 格式化播放量（万次）
        if (programPlayCount) programPlayCount.textContent = formatCount(program.playCount || 0);

        // 2. 渲染课程介绍（使用 introduction 字段）
        if (programIntroduction) programIntroduction.innerHTML = program.desc || '<p>暂无介绍</p>';

        // 3. 渲染常见问题（使用 faq 字段）
        if (programFAQ) programFAQ.innerHTML = program.faq || '<p>暂无常见问题</p>';

        // 4. 渲染侧边栏章节（使用 audios）
        if (sidebarChapters) {
            sidebarChapters.innerHTML = '';
            if (!program.audios || program.audios.length === 0) {
                sidebarChapters.innerHTML = '<div class="chapter-empty">暂无内容</div>';
            } else {
                program.audios.forEach((audio, idx) => {
                    const chapterItem = document.createElement('div');
                    chapterItem.className = idx === 0 ? 'chapter-item active' : 'chapter-item';
                    chapterItem.innerHTML = `
                        <span class="chapter-number">${idx + 1}</span>
                        <div class="chapter-content">
                            <h4 class="chapter-title">${audio.title}</h4>
                        </div>
                        <span class="chapter-duration">${audio.duration || ''}</span>
                    `;
                    sidebarChapters.appendChild(chapterItem);
                });
            }
        }

        // 更新全局状态并绑定按钮行为
        currentProgramId = program.id || program.programId || null;
        currentUiProgram = program;
        // 检查收藏状态（异步）
        if (currentProgramId) {
            checkCollectionStatus(currentProgramId).catch(err => console.warn('checkCollectionStatus error', err));
        }
        bindActionButtons();
    }

    // -------------------------- 5. 辅助函数 --------------------------
    // 格式化数字（万为单位）
    function formatCount(count) {
        return count >= 10000 ? (count / 10000).toFixed(1) + '万' : count;
    }

    // 标签切换逻辑
    function bindTabSwitchEvent() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                // 更新按钮激活状态
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // 更新内容显示（匹配 data-tab 与 tab-content 的 id）
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabName) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // -------------------------- 按钮与收藏功能 --------------------------
    function updateCollectButton(collected) {
        if (!collectBtn) return;
        isCollected = !!collected;
        // 设置按钮显示与 data 属性，供外部判断当前状态
        if (isCollected) {
            collectBtn.textContent = '已收藏';
            collectBtn.classList.remove('btn-secondary');
            collectBtn.classList.add('btn-primary');
            collectBtn.setAttribute('data-collected', 'true');
        } else {
            collectBtn.textContent = '加入收藏';
            collectBtn.classList.remove('btn-primary');
            collectBtn.classList.add('btn-secondary');
            collectBtn.setAttribute('data-collected', 'false');
        }
    }

    function checkCollectionStatus(programId) {
        if (!programId) return Promise.resolve(false);
        // 如果未登录，直接显示未收藏状态
        const authToken = localStorage.getItem('authToken') || localStorage.getItem('userId');
        if (!authToken) {
            updateCollectButton(false);
            return Promise.resolve(false);
        }

        const url = `${API_BASE}/api/collection/check?targetId=${programId}&targetType=program`;
        console.log('checkCollectionStatus ->', url);
        return fetch(url, { method: 'GET', credentials: 'include' })
            .then(res => res.json())
            .then(json => {
                console.log('checkCollectionStatus response', json);
                const collected = json && typeof json.data !== 'undefined' ? json.data : false;
                updateCollectButton(collected);
                return collected;
            })
            .catch(err => {
                console.warn('checkCollectionStatus error', err);
                updateCollectButton(false);
                return false;
            });
    }

    function collectProgram(programId) {
        const url = `${API_BASE}/api/collection/add?targetId=${programId}&targetType=program`;
        console.log('collectProgram ->', url);
        if (!programId) return Promise.reject(new Error('no programId'));
        return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
            .then(res => res.json())
            .then(json => {
                console.log('collectProgram response', json);
                if (json && json.code === 0) {
                    // 操作成功后直接更新按钮状态，无需刷新页面
                    updateCollectButton(true);
                    return true;
                }
                throw new Error(json.message || '收藏失败');
            });
    }

    function cancelCollectProgram(programId) {
        const url = `${API_BASE}/api/collection/remove?targetId=${programId}&targetType=program`;
        console.log('cancelCollectProgram ->', url);
        if (!programId) return Promise.reject(new Error('no programId'));
        return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
            .then(res => res.json())
            .then(json => {
                console.log('cancelCollectProgram response', json);
                if (json && json.code === 0) {
                    // 操作成功后直接更新按钮状态，无需刷新页面
                    updateCollectButton(false);
                    return true;
                }
                throw new Error(json.message || '取消收藏失败');
            });
    }

    function copyToClipboardFallback(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }

    function bindActionButtons() {
        if (studyBtn) {
            studyBtn.onclick = function() {
                if (!currentUiProgram) return;
                const audios = currentUiProgram.audios || [];
                if (!audios || audios.length === 0) {
                    alert('该节目暂无音频内容');
                    return;
                }
                const firstAudio = audios[0];
                const audioId = firstAudio.id || firstAudio.audioId || 0;
                const pid = currentProgramId;
                const url = `player.html?programId=${pid}&audioId=${audioId}`;
                console.log('navigate to', url);
                window.location.href = url;
            };
        }

        if (collectBtn) {
            collectBtn.onclick = function() {
                if (!currentProgramId) return;
                const authToken = localStorage.getItem('authToken') || localStorage.getItem('userId');
                if (!authToken) {
                    alert('请先登录后再收藏');
                    window.location.href = 'login.html';
                    return;
                }
                // 以按钮上的 data-collected 属性为准，避免异步状态不一致
                const isCurrentlyCollected = collectBtn.getAttribute('data-collected') === 'true';
                collectBtn.disabled = true;
                if (isCurrentlyCollected) {
                    cancelCollectProgram(currentProgramId)
                        .then(() => { alert('已取消收藏'); collectBtn.disabled = false; })
                        .catch(err => { alert(err.message || '取消收藏失败'); collectBtn.disabled = false; console.warn(err); });
                } else {
                    collectProgram(currentProgramId)
                        .then(() => { alert('收藏成功'); collectBtn.disabled = false; })
                        .catch(err => { alert(err.message || '收藏失败'); collectBtn.disabled = false; console.warn(err); });
                }
            };
        }

        if (shareBtn) {
            shareBtn.onclick = function() {
                const url = window.location.href;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(() => {
                        alert('链接已复制到剪贴板');
                    }).catch(err => {
                        console.warn('clipboard failed', err);
                        const ok = copyToClipboardFallback(url);
                        alert(ok ? '链接已复制到剪贴板' : '复制失败，请手动复制链接');
                    });
                } else {
                    const ok = copyToClipboardFallback(url);
                    alert(ok ? '链接已复制到剪贴板' : '复制失败，请手动复制链接');
                }
            };
        }
    }

    // -------------------------- 6. 初始化函数 --------------------------
    function init() {
        // 解析URL中的节目ID
        const programId = getProgramIdFromUrl();
        if (!programId) {
            // 无有效ID时显示错误提示
            document.querySelector('.program-content').innerHTML = `
                <div style="text-align: center; padding: 50px 0; color: #666;">
                    无效的节目链接，请返回分类页选择节目～
                </div>
            `;
            return;
        }

        // 尝试从后端获取节目详情
        const apiUrl = `${API_BASE}/programs/${programId}`;
        console.log('Fetching program:', apiUrl);
        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error('network');
                return res.json();
            })
            .then(payload => {
                console.log('API payload:', payload);
                const p = payload && payload.data ? payload.data : null;
                if (!p) throw new Error('no-data');
                const uiProgram = mapApiProgramToUi(p);
                console.log('Mapped UI program:', uiProgram);
                renderProgram(uiProgram);
                bindTabSwitchEvent();
            })
            .catch(err => {
                console.warn('Fetch program failed, fall back to local data:', err);
                const currentProgram = programData.find(program => program.id === programId);
                if (!currentProgram) {
                    document.querySelector('.program-content').innerHTML = `
                        <div style="text-align: center; padding: 50px 0; color: #666;">
                            该节目不存在或已下架～
                        </div>
                    `;
                    return;
                }
                // 将本地结构适配为 renderProgram 接受的格式
                const fallback = {
                    id: currentProgram.id,
                    title: currentProgram.title,
                    cover: currentProgram.cover,
                    episodes: currentProgram.episodes || 0,
                    playCount: currentProgram.playCount || 0,
                    desc: currentProgram.desc || currentProgram.description || '',
                    faq: '',
                    audios: (currentProgram.chapters && currentProgram.chapters.length) ? currentProgram.chapters.reduce((acc,ch)=>{
                        if (ch.lessons && ch.lessons.length) {
                            ch.lessons.forEach(ls=> acc.push({ id: ls.id || 0, title: ls.title || ls, duration: ls.duration || '' }));
                        }
                        return acc;
                    }, []) : []
                };
                renderProgram(fallback);
                bindTabSwitchEvent();
            });
    }

    // -------------------------- 7. 启动初始化 --------------------------
    init();
});