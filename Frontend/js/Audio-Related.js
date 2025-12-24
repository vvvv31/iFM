// ========== 全局变量 ==========
let uploadedAudio = null;
let uploadedAudioUrl = null;
let uploadedAudioName = '';

// 录音相关变量
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let isPaused = false;
let recordingTimer = null;
let recordingSeconds = 0;
let audioContext = null;
let analyser = null;
let source = null;
let audioStream = null;
let selectedFormat = 'mp3'; // 默认输出格式

// 最大录音时长：2小时（7200秒）
const MAX_RECORDING_TIME = 7200;

// 录音历史记录
let recordingHistory = JSON.parse(localStorage.getItem('audioRecorderHistory')) || [];

// 音频可视化
const recorderVisualizer = document.getElementById('recorderVisualizer');
const visualizerCtx = recorderVisualizer.getContext('2d');

// 跟读句子库
const followSentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect when learning a new language.",
    "She sells seashells by the seashore on sunny Sundays.",
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    "I scream, you scream, we all scream for ice cream.",
    "Peter Piper picked a peck of pickled peppers.",
    "A proper copper coffee pot is essential for good coffee.",
    "The rain in Spain falls mainly on the plain.",
    "Six slippery snails slid slowly seaward.",
    "Red lorry, yellow lorry, red lorry, yellow lorry.",
    "Unique New York, you know you need unique New York.",
    "Eleven benevolent elephants were eating elegant eclairs.",
    "Four fine fresh fish for you, sir.",
    "Betty bought a bit of butter but the butter was bitter.",
    "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.",
    "I thought a thought, but the thought I thought wasn't the thought I thought I thought.",
    "If two witches would watch two watches, which witch would watch which watch?",
    "Lesser leather never weathered wetter weather better.",
    "The thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    "Can you can a can as a canner can can a can?"
];

let currentSentenceIndex = 0;

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    // 设置可视化Canvas尺寸
    recorderVisualizer.width = recorderVisualizer.offsetWidth;
    recorderVisualizer.height = recorderVisualizer.offsetHeight;
    
    // 初始化跟读句子
    initializeFollowSentences();
    
    // 加载录音历史
    loadRecordings();
    updateStats();
    
    // 初始化事件监听器
    setupEventListeners();
    
    // 初始化播放器
    initializePlayer();
    
    // 窗口大小调整时重新设置Canvas尺寸
    window.addEventListener('resize', () => {
        recorderVisualizer.width = recorderVisualizer.offsetWidth;
        recorderVisualizer.height = recorderVisualizer.offsetHeight;
    });
}

// ========== 初始化跟读句子 ==========
function initializeFollowSentences() {
    // 显示句子总数
    document.getElementById('totalSentences').textContent = followSentences.length;
    
    // 随机选择一个句子作为初始句子
    currentSentenceIndex = Math.floor(Math.random() * followSentences.length);
    updateSentenceDisplay();
    
    // 更新跟读模式状态
    updateFollowModeStatus();
}

function updateSentenceDisplay() {
    document.getElementById('currentSentence').textContent = followSentences[currentSentenceIndex];
    document.getElementById('sentenceIndex').textContent = currentSentenceIndex + 1;
    
    // 更新导航按钮状态
    const prevBtn = document.getElementById('prevSentenceBtn');
    const nextBtn = document.getElementById('nextSentenceBtn');
    
    prevBtn.disabled = currentSentenceIndex === 0;
    nextBtn.disabled = currentSentenceIndex === followSentences.length - 1;
}

function updateFollowModeStatus() {
    document.getElementById('followModeStatus').textContent = 
        currentSentenceIndex >= 0 ? '开启' : '关闭';
}

// ========== 事件监听器设置 ==========
function setupEventListeners() {
    // 上传相关
    const uploadBox = document.getElementById('uploadBoxMain');
    const mp3Upload = document.getElementById('mp3Upload');
    const closeFileInfo = document.getElementById('closeFileInfo');
    const playUploadBtn = document.getElementById('playUploadBtn');
    const downloadUploadBtn = document.getElementById('downloadUploadBtn');
    
    uploadBox.addEventListener('click', () => mp3Upload.click());
    mp3Upload.addEventListener('change', handleMP3Upload);
    closeFileInfo.addEventListener('click', closeFileInfoPanel);
    playUploadBtn.addEventListener('click', playUploadedAudio);
    downloadUploadBtn.addEventListener('click', downloadUploadedAudio);
    
    // 录音相关
    const startRecordBtn = document.getElementById('startRecordBtn');
    const pauseRecordBtn = document.getElementById('pauseRecordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const saveRecordBtn = document.getElementById('saveRecordBtn');
    const refreshRecordingsBtn = document.getElementById('refreshRecordingsBtn');
    
    startRecordBtn.addEventListener('click', startRecording);
    pauseRecordBtn.addEventListener('click', togglePauseRecording);
    stopRecordBtn.addEventListener('click', stopRecording);
    saveRecordBtn.addEventListener('click', saveRecording);
    refreshRecordingsBtn.addEventListener('click', loadRecordings);
    
    // 时间预设按钮
    document.querySelectorAll('.time-preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-minutes'));
            setRecordingTimePreset(minutes);
        });
    });
    
    // 格式选择按钮
    document.querySelectorAll('.format-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.format-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedFormat = this.getAttribute('data-format');
            document.getElementById('outputFormat').textContent = selectedFormat.toUpperCase();
        });
    });
    
    // 跟读句子导航按钮
    document.getElementById('prevSentenceBtn').addEventListener('click', () => {
        if (currentSentenceIndex > 0) {
            currentSentenceIndex--;
            updateSentenceDisplay();
        }
    });
    
    document.getElementById('nextSentenceBtn').addEventListener('click', () => {
        if (currentSentenceIndex < followSentences.length - 1) {
            currentSentenceIndex++;
            updateSentenceDisplay();
        }
    });
    
    // 点击句子区域随机选择新句子
    document.getElementById('currentSentence').addEventListener('click', () => {
        if (!isRecording) {
            const newIndex = Math.floor(Math.random() * followSentences.length);
            currentSentenceIndex = newIndex;
            updateSentenceDisplay();
            showMessage('已切换为新跟读句子');
        }
    });
}

// ========== 标签页切换 ==========
function showTab(tabName) {
    // 更新标签按钮状态
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // 显示对应的内容区域
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('recordSection').style.display = 'none';
    
    document.getElementById(tabName + 'Section').style.display = 'block';
}

// ========== 上传MP3功能 ==========
function handleMP3Upload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.includes('audio/mpeg') && !file.name.toLowerCase().endsWith('.mp3')) {
        showMessage('请选择MP3格式的音频文件');
        return;
    }
    
    // 检查文件大小（最大100MB）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
        showMessage('文件大小不能超过100MB');
        return;
    }
    
    // 显示上传进度
    showUploadProgress();
    
    // 模拟上传过程
    simulateUpload(file);
}

function showUploadProgress() {
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFillUpload');
    const progressText = document.getElementById('progressText');
    
    uploadProgress.style.display = 'flex';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
}

function simulateUpload(file) {
    let progress = 0;
    const progressFill = document.getElementById('progressFillUpload');
    const progressText = document.getElementById('progressText');
    
    const uploadInterval = setInterval(() => {
        progress += Math.random() * 10 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(uploadInterval);
            completeUpload(file);
        }
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }, 100);
}

function completeUpload(file) {
    // 创建音频URL
    if (uploadedAudioUrl) {
        URL.revokeObjectURL(uploadedAudioUrl);
    }
    
    uploadedAudioUrl = URL.createObjectURL(file);
    uploadedAudioName = file.name;
    
    // 创建音频元素
    uploadedAudio = new Audio(uploadedAudioUrl);
    
    // 获取音频信息
    uploadedAudio.addEventListener('loadedmetadata', () => {
        showFileInfo(file);
        showMessage('MP3文件上传成功');
    });
    
    // 隐藏上传进度
    document.getElementById('uploadProgress').style.display = 'none';
}

function showFileInfo(file) {
    // 更新文件信息
    document.getElementById('infoFileName').textContent = file.name;
    document.getElementById('infoFileSize').textContent = formatFileSize(file.size);
    
    if (uploadedAudio) {
        document.getElementById('infoFileDuration').textContent = formatTime(uploadedAudio.duration);
        
        // 模拟比特率和采样率（实际中需要通过更复杂的方式获取）
        document.getElementById('infoBitrate').textContent = '128 kbps';
        document.getElementById('infoSampleRate').textContent = '44100 Hz';
    }
    
    // 显示文件信息面板
    document.getElementById('uploadFileInfo').style.display = 'block';
    
    // 更新播放器信息
    updatePlayerInfo(uploadedAudioName, '上传音频');
}

function closeFileInfoPanel() {
    document.getElementById('uploadFileInfo').style.display = 'none';
    document.getElementById('mp3Upload').value = '';
}

function playUploadedAudio() {
    if (!uploadedAudio) {
        showMessage('请先上传音频文件');
        return;
    }
    
    // 停止其他音频
    stopCurrentPlayback();
    
    // 播放上传的音频
    uploadedAudio.play();
    
    // 更新播放器状态
    updatePlayerState(true);
    showMessage('正在播放: ' + uploadedAudioName);
    
    // 监听播放结束
    uploadedAudio.onended = () => {
        updatePlayerState(false);
    };
}

function downloadUploadedAudio() {
    if (!uploadedAudioUrl) {
        showMessage('没有可下载的音频文件');
        return;
    }
    
    const link = document.createElement('a');
    link.href = uploadedAudioUrl;
    link.download = uploadedAudioName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage('文件下载中: ' + uploadedAudioName);
}

// ========== 录音功能 ==========
function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showMessage('您的浏览器不支持录音功能');
        return;
    }
    
    // 获取录音名称
    const recordingName = document.getElementById('recordingName').value || '我的录音';
    
    // 请求麦克风权限
    navigator.mediaDevices.getUserMedia({ 
        audio: { 
            channelCount: 1,
            sampleRate: 44100,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        } 
    })
    .then(stream => {
        audioStream = stream;
        isRecording = true;
        
        // 更新UI状态
        updateRecordingUI('recording');
        document.getElementById('visualizerStatusText').textContent = '录音中...';
        document.getElementById('statusIndicator').classList.add('recording-indicator');
        document.getElementById('statusIndicator').style.backgroundColor = '#ff3333';
        
        // 创建AudioContext用于音频可视化
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        // 开始音频可视化
        startAudioVisualization();
        
        // 创建MediaRecorder
        const options = { 
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 128000
        };
        
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            console.warn('使用指定编解码器失败，使用默认设置:', e);
            mediaRecorder = new MediaRecorder(stream);
        }
        
        // 重置录音数据
        audioChunks = [];
        recordingSeconds = 0;
        updateTimeDisplay();
        
        // 录音数据可用时收集
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
                
                // 更新存储使用情况
                updateStorageUsage();
            }
        };
        
        // 录音停止时处理
        mediaRecorder.onstop = () => {
            // 显示MP3转换状态
            if (selectedFormat === 'mp3') {
                showMP3ConversionStatus(true);
                convertToMP3();
            } else {
                processWebMAudio();
            }
        };
        
        // 开始录音
        mediaRecorder.start(100);
        
        // 开始计时器
        startRecordingTimer();
        
        // 显示开始录音消息
        if (currentSentenceIndex >= 0) {
            showMessage(`开始跟读录音：${followSentences[currentSentenceIndex]}`);
        } else {
            showMessage('开始录音');
        }
    })
    .catch(err => {
        console.error('无法访问麦克风:', err);
        showMessage('无法访问麦克风，请检查权限设置或麦克风是否被其他应用占用');
        updateRecordingUI('idle');
    });
}

function processWebMAudio() {
    // 创建录音Blob
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
    
    // 创建录音对象
    const recording = {
        id: Date.now(),
        name: document.getElementById('recordingName').value || '我的录音',
        timestamp: new Date().toLocaleString(),
        duration: recordingSeconds,
        size: audioBlob.size,
        format: 'webm',
        sentence: currentSentenceIndex >= 0 ? followSentences[currentSentenceIndex] : null,
        evaluation: null, // 评测结果初始为null
        blob: audioBlob,
        blobUrl: URL.createObjectURL(audioBlob)
    };
    
    // 保存到临时变量供保存使用
    window.currentRecording = recording;
    
    // 更新UI
    updateRecordingUI('stopped');
    document.getElementById('saveRecordBtn').disabled = false;
    document.getElementById('visualizerStatusText').textContent = '录音完成';
    document.getElementById('statusIndicator').classList.remove('recording-indicator');
    document.getElementById('statusIndicator').style.backgroundColor = '#4CAF50';
    
    // 停止所有轨道以释放麦克风
    audioStream.getTracks().forEach(track => track.stop());
    
    // 停止音频可视化
    stopAudioVisualization();
    
    showMessage('录音完成: ' + recording.name);
}

function convertToMP3() {
    // 创建录音Blob
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
    
    // 读取音频数据
    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        
        // 创建离线音频上下文进行解码
        const offlineContext = new OfflineAudioContext(1, 44100 * recordingSeconds, 44100);
        
        offlineContext.decodeAudioData(arrayBuffer, function(audioBuffer) {
            // 获取音频数据
            const audioData = audioBuffer.getChannelData(0);
            
            // 创建MP3编码器
            const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128);
            
            // 准备音频数据
            const samples = new Int16Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                samples[i] = audioData[i] * 32768;
            }
            
            // 编码MP3
            const mp3Data = [];
            const sampleBlockSize = 1152;
            
            for (let i = 0; i < samples.length; i += sampleBlockSize) {
                const sampleChunk = samples.subarray(i, i + sampleBlockSize);
                const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
                if (mp3buf.length > 0) {
                    mp3Data.push(new Uint8Array(mp3buf));
                }
            }
            
            const mp3buf = mp3Encoder.flush();
            if (mp3buf.length > 0) {
                mp3Data.push(new Uint8Array(mp3buf));
            }
            
            // 创建MP3 Blob
            const mp3Blob = new Blob(mp3Data, { type: 'audio/mpeg' });
            
            // 创建录音对象
            const recording = {
                id: Date.now(),
                name: document.getElementById('recordingName').value || '我的录音',
                timestamp: new Date().toLocaleString(),
                duration: recordingSeconds,
                size: mp3Blob.size,
                format: 'mp3',
                sentence: currentSentenceIndex >= 0 ? followSentences[currentSentenceIndex] : null,
                evaluation: null, // 评测结果初始为null
                blob: mp3Blob,
                blobUrl: URL.createObjectURL(mp3Blob)
            };
            
            // 保存到临时变量供保存使用
            window.currentRecording = recording;
            
            // 隐藏MP3转换状态
            showMP3ConversionStatus(false);
            
            // 更新UI
            updateRecordingUI('stopped');
            document.getElementById('saveRecordBtn').disabled = false;
            document.getElementById('visualizerStatusText').textContent = '录音完成';
            document.getElementById('statusIndicator').classList.remove('recording-indicator');
            document.getElementById('statusIndicator').style.backgroundColor = '#4CAF50';
            
            // 停止所有轨道以释放麦克风
            audioStream.getTracks().forEach(track => track.stop());
            
            // 停止音频可视化
            stopAudioVisualization();
            
            showMessage('录音完成: ' + recording.name + ' (MP3格式)');
        }, function(error) {
            console.error('音频解码失败:', error);
            showMP3ConversionStatus(false);
            showMessage('MP3转换失败，将保存为WebM格式');
            processWebMAudio();
        });
    };
    
    reader.readAsArrayBuffer(audioBlob);
}

function showMP3ConversionStatus(show) {
    const statusElement = document.getElementById('mp3ConversionStatus');
    if (show) {
        statusElement.classList.add('active');
    } else {
        statusElement.classList.remove('active');
    }
}

function togglePauseRecording() {
    if (!isRecording) return;
    
    if (!isPaused) {
        // 暂停录音
        isPaused = true;
        mediaRecorder.pause();
        updateRecordingUI('paused');
        document.getElementById('visualizerStatusText').textContent = '已暂停';
        document.getElementById('statusIndicator').style.backgroundColor = '#FF9800';
        
        // 暂停计时器
        if (recordingTimer) {
            clearInterval(recordingTimer);
            recordingTimer = null;
        }
        
        // 停止音频可视化
        stopAudioVisualization();
        
        showMessage('录音已暂停');
    } else {
        // 继续录音
        isPaused = false;
        mediaRecorder.resume();
        updateRecordingUI('recording');
        document.getElementById('visualizerStatusText').textContent = '录音中...';
        document.getElementById('statusIndicator').style.backgroundColor = '#ff3333';
        
        // 恢复计时器
        startRecordingTimer();
        
        // 恢复音频可视化
        startAudioVisualization();
        
        showMessage('继续录音');
    }
}

function stopRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    isPaused = false;
    
    // 停止录音
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    
    // 停止计时器
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
}

function saveRecording() {
    if (!window.currentRecording) {
        showMessage('没有录音可保存');
        return;
    }
    
    const recording = window.currentRecording;
    
    // 添加到历史记录
    recordingHistory.unshift(recording);
    
    // 限制历史记录数量（最多20条）
    if (recordingHistory.length > 20) {
        recordingHistory = recordingHistory.slice(0, 20);
    }
    
    // 保存到localStorage
    localStorage.setItem('audioRecorderHistory', JSON.stringify(recordingHistory));
    
    // 重新加载录音列表
    loadRecordings();
    
    // 更新统计信息
    updateStats();
    
    // 禁用保存按钮
    document.getElementById('saveRecordBtn').disabled = true;
    
    let message = '录音已保存: ' + recording.name + ' (' + recording.format.toUpperCase() + '格式)';
    if (recording.sentence) {
        message += ' - 跟读练习';
    }
    showMessage(message);
    
    // 自动切换到下一个句子
    if (recording.sentence && currentSentenceIndex < followSentences.length - 1) {
        currentSentenceIndex++;
        updateSentenceDisplay();
    }
}

function setRecordingTimePreset(minutes) {
    // 这里可以设置录音时长限制
    showMessage(`已设置为最长录制 ${minutes} 分钟`);
}

function startRecordingTimer() {
    recordingSeconds = 0;
    updateTimeDisplay();
    
    recordingTimer = setInterval(() => {
        recordingSeconds++;
        updateTimeDisplay();
        
        // 检查是否达到最大录制时间
        if (recordingSeconds >= MAX_RECORDING_TIME) {
            stopRecording();
            showMessage('已达到最大录制时间（2小时），录音已自动停止');
        }
    }, 1000);
}

function updateTimeDisplay() {
    const hours = Math.floor(recordingSeconds / 3600);
    const minutes = Math.floor((recordingSeconds % 3600) / 60);
    const seconds = recordingSeconds % 60;
    
    document.getElementById('currentTimeDisplay').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStorageUsage() {
    // 简单估算存储使用情况
    const bitrate = parseInt(document.getElementById('audioQuality').value);
    const estimatedSizeMB = ((bitrate * recordingSeconds) / (8 * 1024)).toFixed(2);
    document.getElementById('storageUsage').textContent = `${estimatedSizeMB} MB`;
    
    // 更新音量指示器
    if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        // 计算平均音量
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        
        // 更新音量指示器
        const level = Math.min(average / 128 * 100, 100);
        document.getElementById('levelFillRecording').style.width = `${level}%`;
        document.getElementById('levelText').textContent = `${Math.round(level)}%`;
    }
}

function updateRecordingUI(state) {
    const startBtn = document.getElementById('startRecordBtn');
    const pauseBtn = document.getElementById('pauseRecordBtn');
    const stopBtn = document.getElementById('stopRecordBtn');
    const statusText = document.getElementById('recorderStatusText');
    
    switch(state) {
        case 'idle':
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            statusText.textContent = '待机';
            break;
            
        case 'recording':
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            pauseBtn.querySelector('.btn-text').textContent = '暂停';
            statusText.textContent = '录音中';
            break;
            
        case 'paused':
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            pauseBtn.querySelector('.btn-text').textContent = '继续';
            statusText.textContent = '已暂停';
            break;
            
        case 'stopped':
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            pauseBtn.querySelector('.btn-text').textContent = '暂停';
            statusText.textContent = '已完成';
            break;
    }
}

// ========== 音频可视化 ==========
function startAudioVisualization() {
    if (!analyser) return;
    
    function draw() {
        if (!isRecording || isPaused) return;
        
        requestAnimationFrame(draw);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        // 清除画布
        visualizerCtx.clearRect(0, 0, recorderVisualizer.width, recorderVisualizer.height);
        
        // 设置样式
        visualizerCtx.fillStyle = '#FF8C00';
        visualizerCtx.globalAlpha = 0.7;
        
        // 绘制波形条
        const barWidth = (recorderVisualizer.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            // 从中心向两侧绘制
            const y = recorderVisualizer.height / 2 - barHeight / 2;
            
            visualizerCtx.fillRect(x, y, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    draw();
}

function stopAudioVisualization() {
    visualizerCtx.clearRect(0, 0, recorderVisualizer.width, recorderVisualizer.height);
}

// ========== 录音文件管理 ==========
function loadRecordings() {
    const recordingsList = document.getElementById('recordingsList');
    
    if (recordingHistory.length === 0) {
        recordingsList.innerHTML = `
            <div class="empty-files">
                <i class="fas fa-microphone-slash"></i>
                <p>暂无录音文件</p>
                <p>点击"开始录音"按钮创建第一个录音</p>
            </div>
        `;
        return;
    }
    
    recordingsList.innerHTML = '';
    
    recordingHistory.forEach((recording, index) => {
        const recordingItem = document.createElement('div');
        recordingItem.className = 'recording-item';
        
        // 构建句子显示部分
        let sentenceHtml = '';
        if (recording.sentence) {
            sentenceHtml = `
                <div class="recording-sentence">
                    <div class="sentence-label">
                        <i class="fas fa-language"></i> 跟读句子
                    </div>
                    <div class="sentence-content">${recording.sentence}</div>
                </div>
            `;
        }
        
        // 构建评测结果显示部分
        let evaluationHtml = '';
        if (recording.evaluation) {
            const evalData = recording.evaluation;
            evaluationHtml = `
                <div class="evaluation-container">
                    <div class="evaluation-header">
                        <h5><i class="fas fa-chart-line"></i> 跟读评测结果</h5>
                        <div class="evaluation-score">${evalData.overallScore}/100</div>
                    </div>
                    <div class="evaluation-content">
                        <div class="evaluation-metrics">
                            <div class="evaluation-metric">
                                <div class="metric-name">发音准确度</div>
                                <div class="metric-value">${evalData.pronunciationAccuracy}</div>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${evalData.pronunciationAccuracy}%"></div>
                                </div>
                            </div>
                            <div class="evaluation-metric">
                                <div class="metric-name">流利度</div>
                                <div class="metric-value">${evalData.fluency}</div>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${evalData.fluency}%"></div>
                                </div>
                            </div>
                            <div class="evaluation-metric">
                                <div class="metric-name">语调自然度</div>
                                <div class="metric-value">${evalData.intonation}</div>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${evalData.intonation}%"></div>
                                </div>
                            </div>
                            <div class="evaluation-metric">
                                <div class="metric-name">语速节奏</div>
                                <div class="metric-value">${evalData.pace}</div>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: ${evalData.pace}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="evaluation-feedback">
                            <div class="feedback-title">反馈建议:</div>
                            ${evalData.feedback}
                        </div>
                    </div>
                </div>
            `;
        }
        
        // 评测按钮状态
        const evaluateBtnDisabled = recording.evaluation ? 'disabled' : '';
        const evaluateBtnText = recording.evaluation ? '已评测' : '评测';
        const evaluateBtnIcon = recording.evaluation ? 'fas fa-check' : 'fas fa-chart-line';
        
        recordingItem.innerHTML = `
            <div class="recording-header">
                <div class="recording-name">${recording.name}</div>
                <div class="recording-date">${recording.timestamp}</div>
            </div>
            <div class="recording-details">
                <span>时长: ${formatTime(recording.duration)}</span>
                <span>大小: ${formatFileSize(recording.size)}</span>
                <span>格式: ${recording.format ? recording.format.toUpperCase() : 'WEBM'}</span>
                ${recording.sentence ? '<span><i class="fas fa-language"></i> 跟读</span>' : ''}
                ${recording.evaluation ? '<span><i class="fas fa-chart-line"></i> 已评测</span>' : ''}
            </div>
            ${sentenceHtml}
            ${evaluationHtml}
            <div class="recording-actions">
                <button class="recording-play-btn" data-index="${index}">
                    <i class="fas fa-play"></i> 播放
                </button>
                <button class="recording-download-btn" data-index="${index}">
                    <i class="fas fa-download"></i> 下载
                </button>
                <button class="recording-evaluate-btn" data-index="${index}" ${evaluateBtnDisabled}>
                    <i class="${evaluateBtnIcon}"></i> ${evaluateBtnText}
                </button>
                <button class="recording-delete-btn" data-index="${index}">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        `;
        
        recordingsList.appendChild(recordingItem);
    });
    
    // 添加事件监听器
    document.querySelectorAll('.recording-play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            playRecording(index);
        });
    });
    
    document.querySelectorAll('.recording-download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            downloadRecording(index);
        });
    });
    
    document.querySelectorAll('.recording-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteRecording(index);
        });
    });
    
    document.querySelectorAll('.recording-evaluate-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            evaluateRecording(index);
        });
    });
}

// ========== 评测功能 ==========
async function evaluateRecording(index) {
    if (index < 0 || index >= recordingHistory.length) return;
    
    const recording = recordingHistory[index];
    
    // 检查录音是否有跟读句子
    if (!recording.sentence) {
        showMessage('只有跟读录音可以进行评测');
        return;
    }
    
    // 检查是否已经评测过
    if (recording.evaluation) {
        showMessage('该录音已经评测过了');
        return;
    }
    
    // 禁用评测按钮，显示加载状态
    const evaluateBtn = document.querySelector(`.recording-evaluate-btn[data-index="${index}"]`);
    evaluateBtn.disabled = true;
    evaluateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 评测中...';
    
    try {
        // 模拟向服务器发送评测请求
        showMessage('正在向服务器发送评测请求...');
        
        // 模拟POST请求到后端
        const evaluationData = await simulateEvaluationRequest(recording);
        
        // 模拟从后端获取评测结果
        showMessage('正在获取评测结果...');
        const evaluationResult = await simulateGetEvaluationResult(recording.id, evaluationData);
        
        // 更新录音对象的评测结果
        recording.evaluation = evaluationResult;
        
        // 保存到localStorage
        localStorage.setItem('audioRecorderHistory', JSON.stringify(recordingHistory));
        
        // 重新加载录音列表以显示评测结果
        loadRecordings();
        
        // 更新统计信息
        updateStats();
        
        showMessage('评测完成！发音得分：' + evaluationResult.overallScore + '/100');
        
    } catch (error) {
        console.error('评测失败:', error);
        showMessage('评测失败，请稍后重试');
        
        // 恢复评测按钮状态
        evaluateBtn.disabled = false;
        evaluateBtn.innerHTML = '<i class="fas fa-chart-line"></i> 评测';
    }
}

// 模拟发送评测请求到后端
async function simulateEvaluationRequest(recording) {
    // 这里模拟向后端发送POST请求
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟请求数据
            const requestData = {
                recordingId: recording.id,
                sentence: recording.sentence,
                duration: recording.duration,
                timestamp: new Date().toISOString()
            };
            resolve(requestData);
        }, 1000);
    });
}

// 模拟从后端获取评测结果
async function simulateGetEvaluationResult(recordingId, requestData) {
    // 这里模拟从后端获取评测结果
    return new Promise((resolve) => {
        setTimeout(() => {
            // 根据句子长度和录音时长生成模拟评测结果
            const sentence = requestData.sentence;
            const wordCount = sentence.split(' ').length;
            const duration = requestData.duration;
            
            // 生成各项评测指标（基于句子和录音时长的简单模拟）
            const baseScore = 70 + Math.random() * 25; // 70-95分
            
            // 计算语速合理性（假设正常语速是每分钟120个单词）
            const idealDuration = (wordCount / 120) * 60; // 理想时长（秒）
            const durationRatio = Math.min(duration / idealDuration, 2); // 限制最大比率为2
            
            // 生成各项分数
            const pronunciationAccuracy = Math.min(100, Math.round(baseScore + (Math.random() * 10 - 5)));
            const fluency = Math.min(100, Math.round(baseScore + (durationRatio > 1.5 ? -15 : durationRatio < 0.7 ? -10 : 5)));
            const intonation = Math.min(100, Math.round(baseScore + (Math.random() * 10 - 5)));
            const pace = Math.min(100, Math.round(85 - Math.abs(1 - durationRatio) * 20));
            
            // 计算总体分数（加权平均）
            const overallScore = Math.round(
                pronunciationAccuracy * 0.3 + 
                fluency * 0.3 + 
                intonation * 0.25 + 
                pace * 0.15
            );
            
            // 生成反馈建议
            const feedback = generateFeedback(
                pronunciationAccuracy, 
                fluency, 
                intonation, 
                pace, 
                sentence
            );
            
            const evaluationResult = {
                overallScore: overallScore,
                pronunciationAccuracy: pronunciationAccuracy,
                fluency: fluency,
                intonation: intonation,
                pace: pace,
                feedback: feedback,
                evaluatedAt: new Date().toLocaleString()
            };
            
            resolve(evaluationResult);
        }, 2000);
    });
}

// 生成反馈建议
function generateFeedback(pronunciation, fluency, intonation, pace, sentence) {
    const feedbacks = [];
    
    // 发音反馈
    if (pronunciation >= 90) {
        feedbacks.push("发音非常准确，每个单词都清晰可辨。");
    } else if (pronunciation >= 80) {
        feedbacks.push("发音比较准确，但个别单词需要注意。");
    } else if (pronunciation >= 70) {
        feedbacks.push("发音基本正确，但有明显口音或错误。");
    } else {
        feedbacks.push("发音需要加强练习，建议多听标准发音。");
    }
    
    // 流利度反馈
    if (fluency >= 90) {
        feedbacks.push("非常流利，几乎没有停顿。");
    } else if (fluency >= 80) {
        feedbacks.push("比较流利，但有少量不自然的停顿。");
    } else if (fluency >= 70) {
        feedbacks.push("流畅度一般，有明显停顿或重复。");
    } else {
        feedbacks.push("流畅度需要提升，建议放慢语速先保证准确性。");
    }
    
    // 语调反馈
    if (intonation >= 90) {
        feedbacks.push("语调自然，有很好的英语语调感觉。");
    } else if (intonation >= 80) {
        feedbacks.push("语调比较自然，但部分句子升降调不够明显。");
    } else if (intonation >= 70) {
        feedbacks.push("语调较为平淡，缺乏英语的韵律感。");
    } else {
        feedbacks.push("语调需要改进，建议模仿原声的语调变化。");
    }
    
    // 语速反馈
    const wordCount = sentence.split(' ').length;
    if (pace >= 90) {
        feedbacks.push(`语速完美，${wordCount}个单词的句子用时恰到好处。`);
    } else if (pace >= 80) {
        feedbacks.push("语速适中，节奏控制良好。");
    } else if (pace >= 70) {
        feedbacks.push("语速稍快/稍慢，建议调整到更自然的节奏。");
    } else {
        feedbacks.push("语速需要调整，过快或过慢都影响理解。");
    }
    
    // 综合建议
    feedbacks.push("建议多次练习这个句子，直到能够自然流畅地表达。");
    
    return feedbacks.join(' ');
}

function playRecording(index) {
    if (index < 0 || index >= recordingHistory.length) return;
    
    const recording = recordingHistory[index];
    
    // 停止其他音频
    stopCurrentPlayback();
    
    // 创建音频元素并播放
    const audio = new Audio(recording.blobUrl);
    audio.play();
    
    // 更新播放器信息
    let playerType = '录音文件';
    if (recording.sentence) {
        playerType = '跟读练习';
        // 在播放时显示句子提示
        showMessage(`跟读句子：${recording.sentence}`);
    }
    
    updatePlayerInfo(recording.name, playerType);
    updatePlayerState(true);
    
    // 监听播放结束
    audio.onended = () => {
        updatePlayerState(false);
    };
    
    showMessage('正在播放: ' + recording.name);
}

function downloadRecording(index) {
    if (index < 0 || index >= recordingHistory.length) return;
    
    const recording = recordingHistory[index];
    const format = recording.format || 'webm';
    const link = document.createElement('a');
    link.href = recording.blobUrl;
    
    // 构建文件名
    let fileName = recording.name;
    if (!fileName.toLowerCase().endsWith('.' + format)) {
        fileName += '.' + format;
    }
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    let message = '录音下载中: ' + fileName + ' (' + format.toUpperCase() + '格式)';
    if (recording.sentence) {
        message += ' - 跟读练习';
    }
    showMessage(message);
}

function deleteRecording(index) {
    if (index < 0 || index >= recordingHistory.length) return;
    
    const recording = recordingHistory[index];
    const hasSentence = recording.sentence;
    const hasEvaluation = recording.evaluation;
    
    let confirmMessage = '确定要删除这个录音吗？';
    if (hasSentence) confirmMessage += '\n(包含跟读句子内容)';
    if (hasEvaluation) confirmMessage += '\n(包含评测结果)';
    
    if (confirm(confirmMessage)) {
        // 释放URL
        URL.revokeObjectURL(recordingHistory[index].blobUrl);
        
        // 从数组中删除
        recordingHistory.splice(index, 1);
        
        // 保存到localStorage
        localStorage.setItem('audioRecorderHistory', JSON.stringify(recordingHistory));
        
        // 重新加载列表
        loadRecordings();
        
        // 更新统计信息
        updateStats();
        
        showMessage('录音已删除');
    }
}

function updateStats() {
    const totalRecordings = recordingHistory.length;
    let totalDuration = 0;
    let totalStorage = 0;
    let followCount = 0;
    let evaluationCount = 0;
    
    recordingHistory.forEach(recording => {
        totalDuration += recording.duration;
        totalStorage += recording.size;
        if (recording.sentence) {
            followCount++;
        }
        if (recording.evaluation) {
            evaluationCount++;
        }
    });
    
    document.getElementById('recordCount').textContent = totalRecordings;
    document.getElementById('totalDuration').textContent = Math.round(totalDuration / 60);
    document.getElementById('totalStorage').textContent = Math.round(totalStorage / (1024 * 1024));
    document.getElementById('evaluationCount').textContent = evaluationCount;
    
    // 可以在用户信息区域添加跟读统计
    const statsElement = document.querySelector('.stats');
    if (!document.getElementById('followCount')) {
        const followStat = document.createElement('span');
        followStat.id = 'followCount';
        followStat.innerHTML = `跟读 <b>${followCount}</b> 次`;
        statsElement.appendChild(followStat);
    } else {
        document.getElementById('followCount').innerHTML = `跟读 <b>${followCount}</b> 次`;
    }
}

// ========== 播放器功能 ==========
function initializePlayer() {
    const playerPlayBtn = document.getElementById('playerPlayBtn');
    const playerVolumeBtn = document.getElementById('playerVolumeBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    playerPlayBtn.addEventListener('click', togglePlayback);
    playerVolumeBtn.addEventListener('click', toggleMute);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    
    // 音量控制
    const volumeBar = document.querySelector('.volume-bar');
    volumeBar.addEventListener('click', adjustVolume);
    
    // 进度条控制
    const progressBar = document.querySelector('.progress-bar');
    progressBar.addEventListener('click', seekAudio);
}

function togglePlayback() {
    // 这里可以控制当前播放的音频
    // 由于可能有多个音频源，这里简化处理
    showMessage('播放功能已集成到各个音频播放按钮中');
}

function toggleMute() {
    const volumeBtn = document.getElementById('playerVolumeBtn');
    const volumeFill = document.getElementById('playerVolumeFill');
    
    if (uploadedAudio) {
        uploadedAudio.muted = !uploadedAudio.muted;
        
        if (uploadedAudio.muted) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeFill.style.width = '0%';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volumeFill.style.width = '70%';
        }
    }
}

function adjustVolume(e) {
    if (!uploadedAudio) return;
    
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    uploadedAudio.volume = Math.max(0, Math.min(1, percentage));
    document.getElementById('playerVolumeFill').style.width = `${percentage * 100}%`;
}

function seekAudio(e) {
    if (!uploadedAudio) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    uploadedAudio.currentTime = percentage * uploadedAudio.duration;
    document.getElementById('playerProgressFill').style.width = `${percentage * 100}%`;
}

function playPrevious() {
    showMessage('上一曲功能待实现');
}

function playNext() {
    showMessage('下一曲功能待实现');
}

function stopCurrentPlayback() {
    if (uploadedAudio && !uploadedAudio.paused) {
        uploadedAudio.pause();
        uploadedAudio.currentTime = 0;
        updatePlayerState(false);
    }
}

function updatePlayerInfo(name, type) {
    document.getElementById('playerSongName').textContent = name;
    document.getElementById('playerSinger').textContent = type;
    
    if (type === '上传音频') {
        document.getElementById('playerChannelCover').innerHTML = '<i class="fas fa-cloud-upload-alt"></i>';
    } else if (type === '跟读练习') {
        document.getElementById('playerChannelCover').innerHTML = '<i class="fas fa-language"></i>';
    } else {
        document.getElementById('playerChannelCover').innerHTML = '<i class="fas fa-microphone"></i>';
    }
}

function updatePlayerState(isPlaying) {
    const playerPlayBtn = document.getElementById('playerPlayBtn');
    
    if (isPlaying) {
        playerPlayBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
        
        // 更新进度条
        if (uploadedAudio) {
            uploadedAudio.addEventListener('timeupdate', updateProgress);
        }
    } else {
        playerPlayBtn.innerHTML = '<i class="fas fa-play-circle"></i>';
    }
}

function updateProgress() {
    if (!uploadedAudio) return;
    
    const progress = (uploadedAudio.currentTime / uploadedAudio.duration) * 100;
    document.getElementById('playerProgressFill').style.width = `${progress}%`;
    
    // 更新时间显示
    const currentMinutes = Math.floor(uploadedAudio.currentTime / 60);
    const currentSeconds = Math.floor(uploadedAudio.currentTime % 60);
    document.getElementById('playerCurrentTime').textContent = 
        `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
    
    const totalMinutes = Math.floor(uploadedAudio.duration / 60);
    const totalSeconds = Math.floor(uploadedAudio.duration % 60);
    document.getElementById('playerTotalTime').textContent = 
        `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
}

// ========== 工具函数 ==========
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

function showMessage(message) {
    // 移除已有的消息
    const existingMessages = document.querySelectorAll('.message-popup');
    existingMessages.forEach(msg => msg.remove());
    
    // 创建新消息
    const messageEl = document.createElement('div');
    messageEl.className = 'message-popup';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    // 3秒后移除消息
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 3000);
}