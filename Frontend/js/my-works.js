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
    
    // 初始化审核弹窗事件
    initReviewModal();
});

function initMyWorksPage() {
    // 检查是否有作品，如果没有显示空状态
    checkEmptyState();

    // 初始化过滤选项
    initFilterOptions();
    
    // 初始化分页
    initPagination();
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
    if (confirm('确定要发布这个草稿吗？作品将提交审核，审核通过后正式发布。')) {
        // 从localStorage获取草稿
        const draft = JSON.parse(localStorage.getItem(draftId));
        if (draft) {
            // 获取卡片元素
            const card = document.querySelector(`[data-work-id="${draftId}"]`);
            if (card) {
                // 更新卡片状态为审核中
                card.setAttribute('data-status', 'pending');
                
                // 更新状态标签
                const statusLabel = card.querySelector('.work-status');
                if (statusLabel) {
                    statusLabel.className = 'work-status pending';
                    statusLabel.textContent = '审核中';
                }
                
                // 更新元数据显示
                const metaSpan = card.querySelector('.views-count');
                if (metaSpan) {
                    metaSpan.textContent = '审核中';
                }
                
                // 更新统计信息
                const statsSmall = card.querySelector('.work-stats-small');
                if (statsSmall) {
                    statsSmall.innerHTML = `
                        <div class="stat-small">
                            <i class="fas fa-clock"></i>
                            <span>提交于 刚刚</span>
                        </div>
                    `;
                }
                
                // 更新操作按钮
                const actionsDiv = card.querySelector('.work-actions');
                if (actionsDiv) {
                    actionsDiv.innerHTML = `
                        <button class="action-btn-small" onclick="viewWorkStatus('${draftId}')">
                            <i class="fas fa-info-circle"></i> 查看状态
                        </button>
                        <button class="action-btn-small" onclick="cancelReview('${draftId}')">
                            <i class="fas fa-times"></i> 取消审核
                        </button>
                    `;
                }
                
                // 保存审核信息
                saveReviewInfo(draftId, {
                    status: 'pending',
                    submitTime: new Date().toISOString(),
                    estimatedTime: '1-3个工作日',
                    reason: ''
                });
                
                // 更新草稿信息（改为审核中状态）
                draft.status = 'pending';
                draft.submitTime = new Date().toISOString();
                localStorage.setItem(draftId, JSON.stringify(draft));
            }
            
            // 更新作品统计数据
            updateWorkStats();
            
            // 显示提示
            showToast('草稿已提交审核，请耐心等待审核结果。', 'success');
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

    // 分页按钮事件在 initPagination 中处理

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

// 分页配置
const ITEMS_PER_PAGE = 10; // 每页显示的作品数量
let currentPage = 1;
let totalPages = 1;

// 初始化分页
function initPagination() {
    updatePagination();
}

// 更新分页显示
function updatePagination() {
    const works = document.querySelectorAll('.work-card');
    const visibleWorks = Array.from(works).filter(work => work.style.display !== 'none');
    const totalItems = visibleWorks.length;
    
    // 计算总页数
    totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    
    // 确保当前页不超过总页数
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    
    // 更新分页按钮
    renderPaginationButtons();
    
    // 更新上一页/下一页按钮状态
    updatePrevNextButtons();
}

// 渲染分页按钮
function renderPaginationButtons() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    // 清空现有按钮（保留上一页和下一页）
    const prevBtn = pagination.querySelector('.prev-btn');
    const nextBtn = pagination.querySelector('.next-btn');
    
    pagination.innerHTML = '';
    
    // 添加上一页按钮
    if (prevBtn) {
        pagination.appendChild(prevBtn);
    } else {
        const newPrevBtn = document.createElement('button');
        newPrevBtn.className = 'page-btn prev-btn';
        newPrevBtn.textContent = '上一页';
        newPrevBtn.addEventListener('click', goToPrevPage);
        pagination.appendChild(newPrevBtn);
    }
    
    // 生成页码按钮
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', function() {
            goToPage(i);
        });
        pagination.appendChild(pageBtn);
    }
    
    // 添加下一页按钮
    if (nextBtn) {
        pagination.appendChild(nextBtn);
    } else {
        const newNextBtn = document.createElement('button');
        newNextBtn.className = 'page-btn next-btn';
        newNextBtn.textContent = '下一页';
        newNextBtn.addEventListener('click', goToNextPage);
        pagination.appendChild(newNextBtn);
    }
    
    // 重新绑定事件
    pagination.querySelector('.prev-btn').addEventListener('click', goToPrevPage);
    pagination.querySelector('.next-btn').addEventListener('click', goToNextPage);
    
    updatePrevNextButtons();
}

// 更新上一页/下一页按钮状态
function updatePrevNextButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
        prevBtn.style.opacity = currentPage <= 1 ? '0.5' : '1';
        prevBtn.style.cursor = currentPage <= 1 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.style.opacity = currentPage >= totalPages ? '0.5' : '1';
        nextBtn.style.cursor = currentPage >= totalPages ? 'not-allowed' : 'pointer';
    }
}

// 跳转到指定页
function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    
    currentPage = pageNum;
    renderPaginationButtons();
    loadPageData(pageNum);
}

// 页面跳转函数
function goToPrevPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

function goToNextPage() {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

function loadPageData(pageNum) {
    // 这里可以添加加载对应页数据的逻辑
    console.log(`加载第 ${pageNum} 页数据`);
    
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // 跳转到编辑页面，传递作品ID和编辑模式
    window.location.href = `upload-audio.html?mode=edit&id=${workId}`;
}

function viewAnalytics(workId) {
    // 跳转到数据分析页面
    window.location.href = `data-analysis.html?work=${workId}`;
}

function shareWork(workId) {
    alert(`分享作品 ID: ${workId}`);
    // 实际应用中打开分享对话框
}

function publishWork(workId) {
    if (confirm('确定要发布这个作品吗？作品将进入审核状态，审核通过后正式发布。')) {
        // 获取卡片元素
        const card = document.querySelector(`[data-work-id="${workId}"]`);
        if (card) {
            // 更新卡片状态为审核中
            card.setAttribute('data-status', 'pending');
            
            // 更新状态标签
            const statusLabel = card.querySelector('.work-status');
            if (statusLabel) {
                statusLabel.className = 'work-status pending';
                statusLabel.textContent = '审核中';
            }
            
            // 更新操作按钮
            const actionsDiv = card.querySelector('.work-actions');
            if (actionsDiv) {
                actionsDiv.innerHTML = `
                    <button class="action-btn-small" onclick="viewWorkStatus('${workId}')">
                        <i class="fas fa-info-circle"></i> 查看状态
                    </button>
                    <button class="action-btn-small" onclick="cancelReview('${workId}')">
                        <i class="fas fa-times"></i> 取消审核
                    </button>
                `;
            }
            
            // 保存审核信息到本地存储
            saveReviewInfo(workId, {
                status: 'pending',
                submitTime: new Date().toISOString(),
                estimatedTime: '1-3个工作日',
                reason: ''
            });
            
            // 更新统计
            updateWorkStats();
            
            // 显示提示
            showToast('作品已提交审核，请耐心等待审核结果。', 'success');
        }
    }
}

function deleteWork(workId) {
    if (confirm('确定要删除这个作品吗？删除后无法恢复。')) {
        const card = document.querySelector(`[data-work-id="${workId}"]`);
        if (card) {
            card.remove();
            // 删除本地存储的审核信息
            localStorage.removeItem(`review_${workId}`);
            // 更新统计
            updateWorkStats();
            checkEmptyState();
            showToast('作品已删除', 'success');
        }
    }
}

// 当前查看审核状态的作品ID
let currentReviewWorkId = null;

function viewWorkStatus(workId) {
    currentReviewWorkId = workId;
    
    // 获取审核信息
    const reviewInfo = getReviewInfo(workId);
    
    // 获取作品信息
    const card = document.querySelector(`[data-work-id="${workId}"]`);
    const workTitle = card ? card.querySelector('.work-title')?.textContent : '未知作品';
    
    // 构建弹窗内容
    let statusClass = 'pending';
    let statusText = '审核中';
    let statusIcon = 'fa-clock';
    
    if (reviewInfo.status === 'approved') {
        statusClass = 'approved';
        statusText = '已通过';
        statusIcon = 'fa-check-circle';
    } else if (reviewInfo.status === 'rejected') {
        statusClass = 'rejected';
        statusText = '已拒绝';
        statusIcon = 'fa-times-circle';
    }
    
    const modalBody = document.getElementById('reviewModalBody');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="review-status-icon ${statusClass}">
                <i class="fas ${statusIcon}"></i>
            </div>
            <div class="review-info-item">
                <span class="review-info-label">作品名称</span>
                <span class="review-info-value">${workTitle}</span>
            </div>
            <div class="review-info-item">
                <span class="review-info-label">审核状态</span>
                <span class="review-info-value ${statusClass}">${statusText}</span>
            </div>
            <div class="review-info-item">
                <span class="review-info-label">提交时间</span>
                <span class="review-info-value">${formatReviewTime(reviewInfo.submitTime)}</span>
            </div>
            <div class="review-info-item">
                <span class="review-info-label">预计审核时间</span>
                <span class="review-info-value">${reviewInfo.estimatedTime || '1-3个工作日'}</span>
            </div>
            ${reviewInfo.reason ? `
                <div class="review-reason ${statusClass}">
                    <strong>${reviewInfo.status === 'rejected' ? '拒绝原因：' : '审核备注：'}</strong>
                    ${reviewInfo.reason}
                </div>
            ` : `
                <div class="review-reason">
                    <i class="fas fa-info-circle"></i> 您的作品正在审核中，审核人员将在1-3个工作日内完成审核。
                </div>
            `}
        `;
    }
    
    // 控制取消审核按钮的显示
    const cancelBtn = document.getElementById('cancelReviewBtn');
    if (cancelBtn) {
        cancelBtn.style.display = reviewInfo.status === 'pending' ? 'block' : 'none';
    }
    
    // 显示弹窗
    const overlay = document.getElementById('reviewModalOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function cancelReview(workId) {
    if (confirm('确定要取消审核吗？取消后作品将变为草稿状态，需要重新提交审核。')) {
        // 获取卡片元素
        const card = document.querySelector(`[data-work-id="${workId}"]`);
        if (card) {
            // 更新卡片状态为草稿
            card.setAttribute('data-status', 'draft');
            
            // 更新状态标签
            const statusLabel = card.querySelector('.work-status');
            if (statusLabel) {
                statusLabel.className = 'work-status draft';
                statusLabel.textContent = '草稿';
            }
            
            // 更新操作按钮
            const actionsDiv = card.querySelector('.work-actions');
            if (actionsDiv) {
                actionsDiv.innerHTML = `
                    <button class="action-btn-small edit" onclick="editWork('${workId}')">
                        <i class="fas fa-edit"></i> 继续编辑
                    </button>
                    <button class="action-btn-small" onclick="publishWork('${workId}')">
                        <i class="fas fa-paper-plane"></i> 发布
                    </button>
                    <button class="action-btn-small" onclick="deleteWork('${workId}')">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                `;
            }
            
            // 删除审核信息
            localStorage.removeItem(`review_${workId}`);
            
            // 更新统计
            updateWorkStats();
            
            // 关闭弹窗
            hideReviewModal();
            
            // 显示提示
            showToast('已取消审核，作品已变为草稿状态。', 'success');
        }
    }
}

// 保存审核信息
function saveReviewInfo(workId, info) {
    localStorage.setItem(`review_${workId}`, JSON.stringify(info));
}

// 获取审核信息
function getReviewInfo(workId) {
    const saved = localStorage.getItem(`review_${workId}`);
    if (saved) {
        return JSON.parse(saved);
    }
    // 默认返回审核中状态
    return {
        status: 'pending',
        submitTime: new Date().toISOString(),
        estimatedTime: '1-3个工作日',
        reason: ''
    };
}

// 格式化审核时间
function formatReviewTime(isoTime) {
    if (!isoTime) return '未知';
    const date = new Date(isoTime);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 隐藏审核状态弹窗
function hideReviewModal() {
    const overlay = document.getElementById('reviewModalOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
    currentReviewWorkId = null;
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建提示元素
    let toast = document.getElementById('toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-message';
        toast.style.cssText = `
            position: fixed; bottom: 120px; left: 50%; transform: translateX(-50%);
            padding: 12px 24px; border-radius: 8px; font-size: 14px;
            z-index: 100001; opacity: 0; transition: opacity 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(toast);
    }
    
    // 设置样式
    if (type === 'success') {
        toast.style.background = '#4CAF50';
        toast.style.color = '#fff';
    } else if (type === 'error') {
        toast.style.background = '#F44336';
        toast.style.color = '#fff';
    } else {
        toast.style.background = '#FF8C00';
        toast.style.color = '#fff';
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// 初始化审核弹窗事件
function initReviewModal() {
    const overlay = document.getElementById('reviewModalOverlay');
    const closeBtn = document.getElementById('closeReviewModalBtn');
    const closeBtn2 = document.getElementById('closeReviewBtn');
    const cancelBtn = document.getElementById('cancelReviewBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideReviewModal);
    }
    if (closeBtn2) {
        closeBtn2.addEventListener('click', hideReviewModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (currentReviewWorkId) {
                cancelReview(currentReviewWorkId);
            }
        });
    }
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideReviewModal();
            }
        });
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