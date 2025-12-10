/**
 * 节目详情页核心逻辑
 * 功能：1. 解析URL中的节目ID 2. 加载对应节目数据 3. 渲染页面内容
 */
document.addEventListener('DOMContentLoaded', function() {
    // -------------------------- 1. 核心数据（与category.js保持一致，实际项目建议通过接口获取） --------------------------
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
        // 可添加更多节目数据...
    ];

    // -------------------------- 2. 元素获取 --------------------------
    // 节目基本信息
    const programTitle = document.getElementById('programTitle');
    const programCover = document.getElementById('programCover');
    const programLevel = document.getElementById('programLevel');
    const programEpisodes = document.getElementById('programEpisodes');
    const programStatus = document.getElementById('programStatus');
    const programPlayCount = document.getElementById('programPlayCount');
    const programRating = document.getElementById('programRating');
    const programLearnCount = document.getElementById('programLearnCount');
    const programDesc = document.getElementById('programDesc');
    const programGoals = document.getElementById('programGoals');
    // 章节相关
    const programChapters = document.getElementById('programChapters');
    const sidebarChapters = document.getElementById('sidebarChapters');
    // 标签切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // -------------------------- 3. 解析URL中的节目ID --------------------------
    function getProgramIdFromUrl() {
        // 从URL中提取?id=xxx参数
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        // 容错处理：若ID不存在或不是数字，返回null
        return id && !isNaN(id) ? parseInt(id) : null;
    }

    // -------------------------- 4. 渲染页面核心函数 --------------------------
    function renderProgram(program) {
        // 1. 渲染基本信息
        programTitle.textContent = program.title;
        programCover.src = program.cover;
        programCover.alt = program.title;
        programLevel.textContent = program.level;
        programEpisodes.textContent = `${program.episodes}集`;
        programStatus.textContent = program.status;
        // 格式化播放量/学习人数（万次/万人）
        programPlayCount.textContent = formatCount(program.playCount);
        programLearnCount.textContent = formatCount(program.learnCount);
        programRating.textContent = program.rating;

        // 2. 渲染课程介绍和学习目标
        programDesc.textContent = program.desc;
        programGoals.innerHTML = ''; // 清空目标列表
        program.goals.forEach(goal => {
            const li = document.createElement('li');
            li.textContent = goal;
            programGoals.appendChild(li);
        });

        // 3. 渲染课程大纲（主内容区）
        programChapters.innerHTML = '';
        program.chapters.forEach((chapter, chapterIndex) => {
            const unitItem = document.createElement('div');
            unitItem.className = 'unit-item';
            unitItem.innerHTML = `
                <div class="unit-header">
                    <h3>${chapter.unit}</h3>
                    <span class="unit-duration">共${chapter.lessons.length}节课</span>
                </div>
                <div class="lesson-list" id="lessonList-${chapterIndex}"></div>
            `;
            programChapters.appendChild(unitItem);

            // 渲染章节下的课时
            const lessonList = document.getElementById(`lessonList-${chapterIndex}`);
            chapter.lessons.forEach((lesson, lessonIndex) => {
                const lessonItem = document.createElement('div');
                lessonItem.className = 'lesson-item';
                lessonItem.innerHTML = `
                    <div class="lesson-info">
                        <span class="lesson-number">${lessonIndex + 1}</span>
                        <span class="lesson-title">${lesson.title}</span>
                    </div>
                    <span class="lesson-duration">${lesson.duration}</span>
                    <button class="play-btn">▶</button>
                `;
                lessonList.appendChild(lessonItem);
            });
        });

        // 4. 渲染侧边栏章节
        sidebarChapters.innerHTML = '';
        program.chapters.forEach((chapter, chapterIndex) => {
            chapter.lessons.forEach((lesson, lessonIndex) => {
                const chapterItem = document.createElement('div');
                chapterItem.className = chapterIndex === 0 && lessonIndex === 0 ? 'chapter-item active' : 'chapter-item';
                chapterItem.innerHTML = `
                    <span class="chapter-number">${chapterIndex + 1}-${lessonIndex + 1}</span>
                    <div class="chapter-content">
                        <h4 class="chapter-title">${lesson.title}</h4>
                    </div>
                    <span class="chapter-duration">${lesson.duration}</span>
                `;
                sidebarChapters.appendChild(chapterItem);
            });
        });
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
                // 更新内容显示
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}Content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
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

        // 根据ID查找对应节目
        const currentProgram = programData.find(program => program.id === programId);
        if (!currentProgram) {
            // 未找到节目时显示提示
            document.querySelector('.program-content').innerHTML = `
                <div style="text-align: center; padding: 50px 0; color: #666;">
                    该节目不存在或已下架～
                </div>
            `;
            return;
        }

        // 渲染节目内容
        renderProgram(currentProgram);
        // 绑定标签切换事件
        bindTabSwitchEvent();
    }

    // -------------------------- 7. 启动初始化 --------------------------
    init();
});