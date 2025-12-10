// upload-audio.js - 音频上传前端逻辑

// DOM元素
const fileInput = document.getElementById('audio-file');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const fileDuration = document.getElementById('file-duration');
const audioTitle = document.getElementById('audio-title');
const audioDescription = document.getElementById('audio-description');
const audioGroup = document.getElementById('audio-group');
const uploadForm = document.getElementById('upload-form');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const audioPreview = document.getElementById('audio-preview');
const audioPlayer = document.getElementById('audio-player');
const resetBtn = document.getElementById('reset-btn');
const message = document.getElementById('message');

// 全局变量
let selectedFile = null;
let audioURL = null;

// 文件选择事件监听
fileInput.addEventListener('change', handleFileSelect);

// 表单提交事件监听
uploadForm.addEventListener('submit', handleUpload);

// 重置按钮事件监听
resetBtn.addEventListener('click', resetForm);

// 页面加载时获取用户合集列表
document.addEventListener('DOMContentLoaded', () => {
    loadUserGroups();
    initCreateGroupFeature();
});

/**
 * 处理文件选择
 */
function handleFileSelect(event) {
    selectedFile = event.target.files[0];
    if (!selectedFile) return;
    
    // 验证文件类型
    if (!isValidAudioType(selectedFile)) {
        showMessage('不支持的文件类型，仅支持：mp3, aac, m4a', 'error');
        resetFileInput();
        return;
    }
    
    // 验证文件大小
    if (!isValidFileSize(selectedFile)) {
        showMessage('文件大小不能超过500MB', 'error');
        resetFileInput();
        return;
    }
    
    // 显示文件信息
    displayFileInfo(selectedFile);
    
    // 创建音频预览
    createAudioPreview(selectedFile);
}

/**
 * 验证音频文件类型
 */
function isValidAudioType(file) {
    const allowedExtensions = ['mp3', 'aac', 'm4a'];
    const extension = file.name.split('.').pop().toLowerCase();
    const allowedMimeTypes = ['audio/mpeg', 'audio/aac', 'audio/mp4'];
    
    return allowedExtensions.includes(extension) && allowedMimeTypes.includes(file.type);
}

/**
 * 验证文件大小
 */
function isValidFileSize(file) {
    const maxSize = 500 * 1024 * 1024; // 500MB
    return file.size <= maxSize;
}

/**
 * 显示文件信息
 */
function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // 创建音频元素获取时长
    const audio = new Audio();
    audio.preload = 'metadata';
    
    audio.onloadedmetadata = function() {
        URL.revokeObjectURL(audio.src);
        fileDuration.textContent = formatDuration(audio.duration);
    };
    
    audio.src = URL.createObjectURL(file);
    
    fileInfo.style.display = 'block';
}

/**
 * 创建音频预览
 */
function createAudioPreview(file) {
    // 释放之前的URL
    if (audioURL) {
        URL.revokeObjectURL(audioURL);
    }
    
    // 创建新的URL
    audioURL = URL.createObjectURL(file);
    audioPlayer.src = audioURL;
    
    // 显示预览
    audioPreview.style.display = 'block';
}

/**
 * 处理文件上传
 */
async function handleUpload(event) {
    event.preventDefault();
    
    if (!selectedFile) {
        showMessage('请选择音频文件', 'error');
        return;
    }
    
    if (!audioTitle.value.trim()) {
        showMessage('请输入音频标题', 'error');
        return;
    }
    
    // 检查合集选择是否有效
    if (audioGroup.value === 'create_new') {
        showMessage('请先完成合集创建或选择一个已存在的合集', 'error');
        return;
    }
    
    // 收集表单数据
    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', audioTitle.value);
    formData.append('description', audioDescription.value);
    
    // 添加合集ID（如果选择了）
    const groupId = audioGroup.value;
    if (groupId) {
        formData.append('groupId', groupId);
    }
    
    try {
        // 显示上传进度
        progressContainer.style.display = 'block';
        
        // 上传文件
        const response = await uploadAudioFile(formData);
        
        // 处理上传成功
        handleUploadSuccess(response);
    } catch (error) {
        // 处理上传失败
        handleUploadError(error);
    } finally {
        // 隐藏上传进度
        progressContainer.style.display = 'none';
    }
}

/**
 * 加载用户合集列表
 */
function loadUserGroups() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/api/group/user', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                // 清空现有选项（保留默认选项）
                const defaultOption = audioGroup.querySelector('option[value=""]');
                audioGroup.innerHTML = '';
                
                // 添加默认选项
                if (defaultOption) {
                    audioGroup.appendChild(defaultOption);
                } else {
                    const newDefaultOption = document.createElement('option');
                    newDefaultOption.value = '';
                    newDefaultOption.textContent = '不添加到任何合集';
                    audioGroup.appendChild(newDefaultOption);
                }
                
                // 添加合集选项
                data.data.forEach(group => {
                    const option = document.createElement('option');
                    option.value = group._id;
                    option.textContent = group.name;
                    audioGroup.appendChild(option);
                });
            }
            resolve(data);
        })
        .catch(error => {
            console.error('加载合集列表失败:', error);
            reject(error);
        })
        .finally(() => {
            // 确保"创建新合集"选项始终在列表底部
            let createNewOption = audioGroup.querySelector('option[value="create_new"]');
            if (createNewOption) {
                createNewOption.remove();
            }
            
            createNewOption = document.createElement('option');
            createNewOption.value = 'create_new';
            createNewOption.textContent = '+ 创建新合集';
            audioGroup.appendChild(createNewOption);
        });
    });
}

/**
 * 上传音频文件到服务器
 */
function uploadAudioFile(formData) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // 监听上传进度
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                progressFill.style.width = `${percentComplete}%`;
                progressText.textContent = `${percentComplete}%`;
            }
        });
        
        // 监听上传完成
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(xhr.responseText || '上传失败'));
            }
        });
        
        // 监听上传错误
        xhr.addEventListener('error', () => {
            reject(new Error('网络错误，上传失败'));
        });
        
        // 打开连接并发送请求
        xhr.open('POST', 'http://localhost:3000/api/upload/audio', true);
        xhr.setRequestHeader('Authorization', `Bearer ${getAuthToken()}`); // 如果需要认证
        xhr.send(formData);
    });
}

/**
 * 处理上传成功
 */
function handleUploadSuccess(response) {
    showMessage('音频上传成功！', 'success');
    
    // 显示上传结果信息
    console.log('上传成功:', response);
    
    // 重置表单
    resetForm();
}

/**
 * 处理上传失败
 */
function handleUploadError(error) {
    showMessage(error.message || '上传失败，请重试', 'error');
}

/**
 * 重置表单
 */
function resetForm() {
    // 重置文件输入
    resetFileInput();
    
    // 重置表单字段
    uploadForm.reset();
    
    // 隐藏预览和信息
    fileInfo.style.display = 'none';
    audioPreview.style.display = 'none';
    
    // 释放音频URL
    if (audioURL) {
        URL.revokeObjectURL(audioURL);
        audioURL = null;
    }
    
    // 清空消息
    message.style.display = 'none';
}

/**
 * 重置文件输入
 */
function resetFileInput() {
    selectedFile = null;
    fileInput.value = '';
}

/**
 * 显示消息
 */
function showMessage(text, type = 'info') {
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    
    // 3秒后自动隐藏消息
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化时长
 */
function formatDuration(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 获取认证令牌
 * 注意：实际应用中需要从存储或其他方式获取有效的认证令牌
 */
function getAuthToken() {
    // 这里只是一个示例，实际应用中需要实现正确的认证逻辑
    return localStorage.getItem('authToken') || '';
}

/**
 * 初始化创建合集功能
 */
function initCreateGroupFeature() {
    const modalOverlay = document.getElementById('modal-overlay');
    const cancelCreateGroupBtn = document.getElementById('cancel-create-group');
    const submitCreateGroupBtn = document.getElementById('submit-create-group');
    const audioGroupSelect = document.getElementById('audio-group');
    
    // 显示创建合集模态框
    function showCreateGroupModal() {
        modalOverlay.classList.add('active');
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 隐藏创建合集模态框
    function hideCreateGroupModal() {
        modalOverlay.classList.remove('active');
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
        // 重置选择为默认选项
        audioGroupSelect.value = '';
        // 清空表单
        document.getElementById('new-group-name').value = '';
        document.getElementById('new-group-desc').value = '';
    }
    
    // 点击模态框外部区域关闭模态框
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            hideCreateGroupModal();
        }
    });
    
    // 监听合集选择事件
    audioGroupSelect.addEventListener('change', () => {
        if (audioGroupSelect.value === 'create_new') {
            showCreateGroupModal();
        } else {
            hideCreateGroupModal();
        }
    });
    
    // 隐藏创建合集模态框 - 取消按钮
    cancelCreateGroupBtn.addEventListener('click', hideCreateGroupModal);
    
    // 提交创建合集请求
    submitCreateGroupBtn.addEventListener('click', async () => {
        const groupName = document.getElementById('new-group-name').value.trim();
        const groupDesc = document.getElementById('new-group-desc').value.trim();
        
        // 验证表单
        if (!groupName) {
            showMessage('请输入合集名称', 'error');
            return;
        }
        
        // 检查用户是否已登录
        const authToken = getAuthToken();
        if (!authToken) {
            showMessage('请先登录后再创建合集', 'error');
            return;
        }
        
        try {
            // 发送创建合集请求
            const response = await fetch('http://localhost:3000/api/group/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    name: groupName,
                    description: groupDesc
                })
            });
            
            // 检查响应状态
            if (!response.ok) {
                if (response.status === 401) {
                    showMessage('登录已过期，请重新登录', 'error');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.code === 200) {
                // 隐藏创建合集模态框
                hideCreateGroupModal();
                
                // 重新加载用户合集列表并自动选择新创建的合集
                loadUserGroups().then(() => {
                    // 选择新创建的合集
                    if (data.data && data.data._id) {
                        audioGroupSelect.value = data.data._id;
                    }
                });
                
                showMessage('合集创建成功！', 'success');
            } else {
                showMessage('创建合集失败: ' + (data.message || '未知错误'), 'error');
            }
        } catch (error) {
            console.error('创建合集失败:', error);
            if (error.message.includes('401')) {
                showMessage('登录已过期，请重新登录', 'error');
            } else if (error.message.includes('NetworkError')) {
                showMessage('网络错误，请检查网络连接', 'error');
            } else {
                showMessage('创建合集失败，请稍后重试', 'error');
            }
        }
    });
}
