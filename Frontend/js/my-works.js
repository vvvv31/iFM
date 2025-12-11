/**
 * 我的作品页面交互逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initMyWorksPage();

    // 绑定事件
    bindEvents();
});

function initMyWorksPage() {
    // 检查是否有作品，如果没有显示空状态
    checkEmptyState();

    // 初始化过滤选项
    initFilterOptions();
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
    alert('创建新草稿');
    // 实际应用中可以打开创建草稿的模态框或跳转到编辑页面
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