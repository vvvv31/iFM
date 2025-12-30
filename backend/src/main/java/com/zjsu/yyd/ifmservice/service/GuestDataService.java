package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.user.UserHistory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 游客数据管理服务
 * 
 * 功能：
 * 1. 临时存储游客的收听历史
 * 2. 管理游客会话数据
 * 3. 定时清理过期数据
 * 4. 数据分离（游客数据与登录用户数据完全分离）
 */
@Service
public class GuestDataService {

    // 游客会话数据存储（内存中）
    private final Map<String, GuestSession> guestSessions = new ConcurrentHashMap<>();
    
    // 游客收听历史存储
    private final Map<String, List<GuestHistoryItem>> guestHistory = new ConcurrentHashMap<>();
    
    // 游客临时ID生成器
    private final AtomicLong guestIdGenerator = new AtomicLong(1000000);
    
    // 定时清理任务
    private final ScheduledExecutorService cleanupExecutor = Executors.newScheduledThreadPool(1);
    
    // 数据过期时间（30分钟）
    private static final long SESSION_TIMEOUT_MINUTES = 30;
    private static final long HISTORY_MAX_SIZE = 50; // 每个游客最多保存50条历史记录

    public GuestDataService() {
        // 启动定时清理任务，每10分钟清理一次过期数据
        cleanupExecutor.scheduleAtFixedRate(this::cleanupExpiredData, 10, 10, TimeUnit.MINUTES);
    }

    /**
     * 创建或获取游客会话
     */
    public String createGuestSession() {
        String guestId = "guest_" + guestIdGenerator.getAndIncrement();
        String sessionId = UUID.randomUUID().toString();
        
        GuestSession session = new GuestSession();
        session.setGuestId(guestId);
        session.setSessionId(sessionId);
        session.setCreatedAt(LocalDateTime.now());
        session.setLastActiveAt(LocalDateTime.now());
        
        guestSessions.put(sessionId, session);
        guestHistory.put(sessionId, new ArrayList<>());
        
        return sessionId;
    }

    /**
     * 获取游客会话信息
     */
    public GuestSession getGuestSession(String sessionId) {
        GuestSession session = guestSessions.get(sessionId);
        if (session != null) {
            // 更新最后活跃时间
            session.setLastActiveAt(LocalDateTime.now());
            return session;
        }
        return null;
    }

    /**
     * 添加游客收听历史
     */
    public void addGuestHistory(String sessionId, Long audioId, String audioTitle, String teacherName) {
        GuestSession session = getGuestSession(sessionId);
        if (session == null) {
            return; // 无效会话
        }

        GuestHistoryItem historyItem = new GuestHistoryItem();
        historyItem.setAudioId(audioId);
        historyItem.setAudioTitle(audioTitle);
        historyItem.setTeacherName(teacherName);
        historyItem.setListenedAt(LocalDateTime.now());
        historyItem.setSessionId(sessionId);

        List<GuestHistoryItem> userHistory = guestHistory.computeIfAbsent(sessionId, k -> new ArrayList<>());
        
        // 检查是否已存在该音频的记录，如果存在则更新时间
        for (GuestHistoryItem existing : userHistory) {
            if (existing.getAudioId().equals(audioId)) {
                existing.setListenedAt(LocalDateTime.now());
                return;
            }
        }

        // 添加新记录
        userHistory.add(0, historyItem); // 添加到开头
        
        // 限制历史记录数量
        if (userHistory.size() > HISTORY_MAX_SIZE) {
            userHistory = userHistory.subList(0, (int) HISTORY_MAX_SIZE);
        }
        
        guestHistory.put(sessionId, userHistory);
    }

    /**
     * 获取游客收听历史
     */
    public List<GuestHistoryItem> getGuestHistory(String sessionId) {
        List<GuestHistoryItem> history = guestHistory.get(sessionId);
        if (history == null) {
            return new ArrayList<>();
        }
        
        // 按时间倒序排列
        history.sort(Comparator.comparing(GuestHistoryItem::getListenedAt).reversed());
        return new ArrayList<>(history);
    }

    /**
     * 清理过期数据
     */
    private void cleanupExpiredData() {
        LocalDateTime expireTime = LocalDateTime.now().minusMinutes(SESSION_TIMEOUT_MINUTES);
        
        // 清理过期的会话
        List<String> expiredSessions = new ArrayList<>();
        for (Map.Entry<String, GuestSession> entry : guestSessions.entrySet()) {
            if (entry.getValue().getLastActiveAt().isBefore(expireTime)) {
                expiredSessions.add(entry.getKey());
            }
        }
        
        for (String sessionId : expiredSessions) {
            guestSessions.remove(sessionId);
            guestHistory.remove(sessionId);
        }
        
        System.out.println("清理过期游客数据: " + expiredSessions.size() + " 个会话");
    }

    /**
     * 手动清理所有游客数据
     */
    public void clearAllGuestData() {
        guestSessions.clear();
        guestHistory.clear();
        System.out.println("手动清理所有游客数据完成");
    }

    /**
     * 获取游客数据统计信息
     */
    public Map<String, Object> getGuestStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeSessions", guestSessions.size());
        stats.put("totalHistoryItems", guestHistory.values().stream().mapToInt(List::size).sum());
        stats.put("sessionTimeoutMinutes", SESSION_TIMEOUT_MINUTES);
        stats.put("maxHistorySize", HISTORY_MAX_SIZE);
        return stats;
    }

    // ============ 内部类定义 ============

    /**
     * 游客会话信息
     */
    public static class GuestSession {
        private String guestId;
        private String sessionId;
        private LocalDateTime createdAt;
        private LocalDateTime lastActiveAt;

        // Getters and Setters
        public String getGuestId() { return guestId; }
        public void setGuestId(String guestId) { this.guestId = guestId; }

        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getLastActiveAt() { return lastActiveAt; }
        public void setLastActiveAt(LocalDateTime lastActiveAt) { this.lastActiveAt = lastActiveAt; }
    }

    /**
     * 游客收听历史项目
     */
    public static class GuestHistoryItem {
        private String sessionId;
        private Long audioId;
        private String audioTitle;
        private String teacherName;
        private LocalDateTime listenedAt;

        // Getters and Setters
        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public Long getAudioId() { return audioId; }
        public void setAudioId(Long audioId) { this.audioId = audioId; }

        public String getAudioTitle() { return audioTitle; }
        public void setAudioTitle(String audioTitle) { this.audioTitle = audioTitle; }

        public String getTeacherName() { return teacherName; }
        public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

        public LocalDateTime getListenedAt() { return listenedAt; }
        public void setListenedAt(LocalDateTime listenedAt) { this.listenedAt = listenedAt; }
    }
}