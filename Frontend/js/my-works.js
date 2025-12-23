/**
 * 我的作品页面交互逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initMyWorksPage();

    // 绑定事件
    bindEvents();
    
    // 加载已发布作品
    loadPublishedWorks();
    
    // 加载草稿
    loadDrafts();
    
    // 初始化更新作品统计数据
    updateWorkStats();
});

function initMyWorksPage() {
    // 检查是否有作品，如果没有显示空状态
    checkEmptyState();

    // 初始化过滤选项
    initFilterOptions();
}

function loadDrafts() {
    // 从localStorage获取所有草稿
    const drafts = getSavedDrafts();
    
    if (drafts.length > 0) {
        // 渲染草稿卡片
        renderDraftCards(drafts);
        // 重新检查空状态
        checkEmptyState();
        // 应用过滤
        applyFilters();
        // 更新作品统计数据
        updateWorkStats();
    }
}

function getSavedDrafts() {
    // 从localStorage获取所有草稿
    const drafts = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('draft_')) {
            try {
                const draft = JSON.parse(localStorage.getItem(key));
                drafts.push(draft);
            } catch (e) {
                console.error('解析草稿失败:', e);
            }
        }
    }
    return drafts;
}

function renderDraftCards(drafts) {
    const worksGrid = document.querySelector('#worksGrid');
    
    drafts.forEach(draft => {
        // 检查是否已存在该草稿卡片，避免重复添加
        const existingCard = document.querySelector(`[data-work-id="${draft.id}"]`);
        if (existingCard) {
            return; // 跳过已存在的草稿
        }
        
        // 创建草稿卡片
        const draftCard = createDraftCard(draft);
        // 添加到作品网格的开头
        worksGrid.insertBefore(draftCard, worksGrid.firstChild);
    });
}

function createDraftCard(draft) {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.setAttribute('data-work-id', draft.id || 'draft_' + new Date().getTime());
    card.setAttribute('data-status', 'draft');
    card.setAttribute('data-category', draft.category || 'audio');
    
    // 构建卡片HTML
    card.innerHTML = `
        <div class="work-status draft">草稿</div>
        <div class="work-thumbnail">
            <div class="thumbnail-overlay">
                <span class="play-icon">▶</span>
                <span class="audio-duration">${draft.duration || '00:00'}</span>
            </div>
        </div>
        <div class="work-info">
            <h3 class="work-title">${draft.title || '未命名草稿'}</h3>
            <div class="work-meta">
                <span class="views-count">草稿</span>
                <span class="rating">-</span>
            </div>
            <div class="work-stats-small">
                <div class="stat-small">
                    <i class="fas fa-clock"></i>
                    <span>${formatDate(draft.lastSaved)}</span>
                </div>
                <div class="stat-small">
                    <i class="fas fa-file-alt"></i>
                    <span>草稿</span>
                </div>
            </div>
            <div class="work-actions">
                <button class="action-btn-small edit" onclick="editDraft('${draft.id}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="action-btn-small" onclick="publishDraft('${draft.id}')">
                    <i class="fas fa-publish"></i> 发布
                </button>
                <button class="action-btn-small delete" onclick="deleteDraft('${draft.id}')">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function formatDate(timestamp) {
    if (!timestamp) return '未保存';
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function editDraft(draftId) {
    // 跳转到编辑草稿页面
    window.location.href = `upload-audio.html?mode=draft&id=${draftId}`;
}

function publishDraft(draftId) {
    if (confirm('确定要发布这个草稿吗？')) {
        // 从localStorage获取草稿
        const draft = JSON.parse(localStorage.getItem(draftId));
        if (draft) {
            // 模拟发布操作
            alert('草稿已发布');
            // 删除草稿
            localStorage.removeItem(draftId);
            // 移除卡片
            const card = document.querySelector(`[data-work-id="${draftId}"]`);
            if (card) {
                card.remove();
            }
            // 检查空状态
            checkEmptyState();
            // 更新作品统计数据
            updateWorkStats();
        }
    }
}

function deleteDraft(draftId) {
    if (confirm('确定要删除这个草稿吗？删除后无法恢复。')) {
        // 删除草稿
        localStorage.removeItem(draftId);
        // 移除卡片
        const card = document.querySelector(`[data-work-id="${draftId}"]`);
        if (card) {
            card.remove();
            // 检查空状态
            checkEmptyState();
            // 更新作品统计数据
            updateWorkStats();
        }
    }
}

function bindEvents() {
    // 过滤选项点击事件
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function() {
            const group = this.parentElement;
            const activeBtn = group.querySelector('.filter-option.active');
            if (activeBtn) activeBtn.classList.remove('active');
            this.classList.add('active');

            // 应用过滤
            applyFilters();
        });
    });

    // 作品卡片点击事件
    document.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的是操作按钮，不触发卡片点击
            if (e.target.closest('.work-actions')) {
                return;
            }

            const workId = this.getAttribute('data-work-id');
            viewWorkDetail(workId);
        });
    });

    // 分页按钮点击事件
    document.querySelectorAll('.page-btn:not(.prev-btn):not(.next-btn)').forEach(btn => {
        btn.addEventListener('click', function() {
            const activeBtn = document.querySelector('.page-btn.active');
            if (activeBtn) activeBtn.classList.remove('active');
            this.classList.add('active');
            // 这里可以添加加载对应页数据的逻辑
        });
    });

    // 上一页/下一页按钮
    document.querySelector('.prev-btn').addEventListener('click', goToPrevPage);
    document.querySelector('.next-btn').addEventListener('click', goToNextPage);

    // 作品卡片操作按钮事件委托
    document.querySelector('#worksGrid').addEventListener('click', function(e) {
        const editBtn = e.target.closest('.action-btn-small.edit');
        if (editBtn) {
            const card = editBtn.closest('.work-card');
            const workId = card.getAttribute('data-work-id');
            editWork(workId);
            return;
        }
    });
}

function applyFilters() {
    const statusFilter = document.querySelector('#statusOptions .filter-option.active').getAttribute('data-status');
    const categoryFilter = document.querySelector('#categoryOptions .filter-option.active').getAttribute('data-category');
    const sortOption = document.querySelector('#sortOptions .filter-option.active').getAttribute('data-sort');

    const works = document.querySelectorAll('.work-card');
    let visibleCount = 0;

    works.forEach(work => {
        const workStatus = work.getAttribute('data-status');
        const workCategory = work.getAttribute('data-category');

        const statusMatch = statusFilter === 'all' || workStatus === statusFilter;
        const categoryMatch = categoryFilter === 'all' || workCategory === categoryFilter;

        if (statusMatch && categoryMatch) {
            work.style.display = 'flex';
            visibleCount++;
        } else {
            work.style.display = 'none';
        }
    });

    // 检查空状态
    checkEmptyState();

    // 根据排序选项排序
    sortWorks(sortOption);
}

function sortWorks(sortOption) {
    const worksGrid = document.querySelector('#worksGrid');
    const works = Array.from(document.querySelectorAll('.work-card'));

    // 过滤出可见的作品
    const visibleWorks = works.filter(work => work.style.display !== 'none');

    visibleWorks.sort((a, b) => {
        switch(sortOption) {
            case 'time':
                // 按ID模拟时间排序（实际应用中应使用发布时间）
                return parseInt(b.getAttribute('data-work-id')) - parseInt(a.getAttribute('data-work-id'));
            case 'popularity':
                const aViews = parseInt(a.querySelector('.views-count').textContent) || 0;
                const bViews = parseInt(b.querySelector('.views-count').textContent) || 0;
                return bViews - aViews;
            case 'comments':
                const aComments = parseInt(a.querySelector('.stat-small:nth-child(2) span').textContent) || 0;
                const bComments = parseInt(b.querySelector('.stat-small:nth-child(2) span').textContent) || 0;
                return bComments - aComments;
            case 'likes':
                const aLikes = parseInt(a.querySelector('.stat-small:nth-child(1) span').textContent) || 0;
                const bLikes = parseInt(b.querySelector('.stat-small:nth-child(1) span').textContent) || 0;
                return bLikes - aLikes;
            default:
                return 0;
        }
    });

    // 重新排列可见的作品
    visibleWorks.forEach(work => {
        worksGrid.appendChild(work);
    });
}

function checkEmptyState() {
    const works = document.querySelectorAll('.work-card');
    const emptyState = document.querySelector('#emptyState');
    let visibleCount = 0;

    works.forEach(work => {
        if (work.style.display !== 'none') {
            visibleCount++;
        }
    });

    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

function updateWorkStats() {
    // 计算已发布作品数量
    const publishedWorks = document.querySelectorAll('.work-card[data-status="published"]');
    const publishedCount = publishedWorks.length;
    
    // 计算草稿数量（包括页面上的和本地存储中的）
    const draftWorks = document.querySelectorAll('.work-card[data-status="draft"]');
    const draftCount = draftWorks.length;
    
    // 计算审核中作品数量
    const pendingWorks = document.querySelectorAll('.work-card[data-status="pending"]');
    const pendingCount = pendingWorks.length;
    
    // 计算作品总数
    const totalCount = publishedCount + draftCount + pendingCount;
    
    // 更新统计数据
    document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = totalCount;
    document.querySelector('.stat-item:nth-child(2) .stat-value').textContent = publishedCount;
    document.querySelector('.stat-item:nth-child(3) .stat-value').textContent = draftCount;
    document.querySelector('.stat-item:nth-child(4) .stat-value').textContent = pendingCount;
}

function initFilterOptions() {
    // 可以在这里初始化更多过滤选项
    console.log('过滤选项已初始化');
}

// 页面跳转函数
function goToPrevPage() {
    const activePage = document.querySelector('.page-btn.active');
    const pageNum = parseInt(activePage.textContent);

    if (pageNum > 1) {
        const prevBtn = document.querySelector(`.page-btn:nth-child(${pageNum})`);
        if (prevBtn) {
            activePage.classList.remove('active');
            prevBtn.classList.add('active');
            // 加载对应页数据
            loadPageData(pageNum - 1);
        }
    }
}

function goToNextPage() {
    const activePage = document.querySelector('.page-btn.active');
    const pageNum = parseInt(activePage.textContent);
    const totalPages = document.querySelectorAll('.page-btn:not(.prev-btn):not(.next-btn)').length;

    if (pageNum < totalPages) {
        const nextBtn = document.querySelector(`.page-btn:nth-child(${pageNum + 2})`);
        if (nextBtn) {
            activePage.classList.remove('active');
            nextBtn.classList.add('active');
            // 加载对应页数据
            loadPageData(pageNum + 1);
        }
    }
}

function loadPageData(pageNum) {
    // 这里可以添加加载对应页数据的逻辑
    console.log(`加载第 ${pageNum} 页数据`);
}

// 操作函数
function uploadNewWork() {
    window.location.href = 'upload-audio.html';
    // window.location.href = 'upload-audio.html';
}

function createNewDraft() {
    // 跳转到带有draft参数的上传页面，实现创建新草稿功能
    window.location.href = 'upload-audio.html?mode=draft';
}

function manageWorks() {
    alert('批量管理作品');
    // 实际应用中可以打开批量管理界面
}

function refreshWorks() {
    alert('刷新作品列表');
    // 实际应用中可以重新加载数据
}

function filterWorks(status) {
    // 点击统计卡片时过滤作品
    const statusOptions = document.querySelectorAll('#statusOptions .filter-option');
    statusOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-status') === status) {
            option.classList.add('active');
        } else if (status === 'all' && option.getAttribute('data-status') === 'all') {
            option.classList.add('active');
        }
    });

    applyFilters();
}

function viewWorkDetail(workId) {
    alert(`查看作品详情 ID: ${workId}`);
    // 实际应用中跳转到作品详情页
    // window.location.href = `work-detail.html?id=${workId}`;
}

function editWork(workId) {
    alert(`编辑作品 ID: ${workId}`);
    // 实际应用中跳转到编辑页面
    // window.location.href = `edit-work.html?id=${workId}`;
}

function viewAnalytics(workId) {
    alert(`查看作品数据分析 ID: ${workId}`);
    // 实际应用中跳转到数据分析页面
    // window.location.href = `data-analysis.html?work=${workId}`;
}

function shareWork(workId) {
    alert(`分享作品 ID: ${workId}`);
    // 实际应用中打开分享对话框
}

function publishWork(workId) {
    if (confirm('确定要发布这个作品吗？')) {
        alert(`发布作品 ID: ${workId}`);
        // 实际应用中调用发布API
    }
}

function deleteWork(workId) {
    if (confirm('确定要删除这个作品吗？删除后无法恢复。')) {
        alert(`删除作品 ID: ${workId}`);
        // 实际应用中调用删除API
    }
}

function viewWorkStatus(workId) {
    alert(`查看作品审核状态 ID: ${workId}`);
    // 实际应用中显示审核状态详情
}

function cancelReview(workId) {
    if (confirm('确定要取消审核吗？取消后需要重新提交审核。')) {
        alert(`取消审核作品 ID: ${workId}`);
        // 实际应用中调用取消审核API
    }
}


function loadPublishedWorks() {
    // 从localStorage获取已发布作品
    const publishedWorks = JSON.parse(localStorage.getItem('publishedWorks') || '[]');
    
    if (publishedWorks.length > 0) {
        // 渲染已发布作品
        renderPublishedWorks(publishedWorks);
        // 重新检查空状态
        checkEmptyState();
        // 应用过滤
        applyFilters();
        // 更新作品统计数据
        updateWorkStats();
    }
}

function renderPublishedWorks(works) {
    const worksGrid = document.querySelector('#worksGrid');
    
    works.forEach(work => {
        // 创建作品卡片
        const workCard = createWorkCard(work);
        // 添加到作品网格
        worksGrid.appendChild(workCard);
    });
}

function createWorkCard(work) {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.setAttribute('data-work-id', work.id);
    card.setAttribute('data-status', work.status);
    card.setAttribute('data-category', work.category);
    
    // 构建卡片HTML，包含课程和单元信息
    card.innerHTML = `
        <div class="work-status published">已发布</div>
        <div class="work-thumbnail">
            <div class="thumbnail-overlay">
                <span class="play-icon">▶</span>
                <span class="audio-duration">${work.duration || '00:00'}</span>
            </div>
        </div>
        <div class="work-info">
            <h3 class="work-title">${work.title || '未命名作品'}</h3>
            <div class="work-category">${work.category || '其他'}</div>
            ${work.course ? `
            <div class="work-course-info">
                <span class="course-label">课程：</span>
                <span class="course-name">${work.course.name}</span>
            </div>` : ''}
            ${work.unit ? `
            <div class="work-unit-info">
                <span class="unit-label">单元：</span>
                <span class="unit-name">${work.unit.name}</span>
            </div>` : ''}
            <div class="work-meta">
                <span class="views-count">${work.views || 0}次播放</span>
                <span class="rating">★★★★★</span>
            </div>
            <div class="work-stats-small">
                <div class="stat-small">
                    <i class="fas fa-heart"></i>
                    <span>${work.likes || 0}</span>
                </div>
                <div class="stat-small">
                    <i class="fas fa-comment"></i>
                    <span>${work.comments || 0}</span>
                </div>
                <div class="stat-small">
                    <i class="fas fa-share"></i>
                    <span>${work.shares || 0}</span>
                </div>
            </div>
            <div class="work-actions">
                <button class="action-btn-small edit" onclick="editWork('${work.id}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="action-btn-small" onclick="viewAnalytics('${work.id}')">
                    <i class="fas fa-chart-line"></i> 数据
                </button>
                <button class="action-btn-small" onclick="shareWork('${work.id}')">
                    <i class="fas fa-share"></i> 分享
                </button>
            </div>
        </div>
    `;
    
    return card;
}