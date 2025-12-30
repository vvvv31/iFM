package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.service.GuestDataService;
import com.zjsu.yyd.ifmservice.service.DailySentenceService;
import com.zjsu.yyd.ifmservice.model.dailySentence.DailySentence;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 游客模式控制器 - 处理未登录用户的访问
 */
@RestController
@RequestMapping("/api/guest")
@Tag(name = "游客模式接口", description = "为未登录用户提供基础功能访问")
public class GuestController {

    private final GuestDataService guestDataService;
    
    @Autowired
    private DailySentenceService dailySentenceService;

    public GuestController(GuestDataService guestDataService) {
        this.guestDataService = guestDataService;
    }

    @Operation(summary = "创建游客会话", description = "为新游客创建会话并返回会话ID")
    @PostMapping("/session")
    public Result<Map<String, Object>> createSession() {
        String sessionId = guestDataService.createGuestSession();
        
        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", sessionId);
        result.put("createdAt", System.currentTimeMillis());
        result.put("message", "游客会话创建成功");
        
        return Result.success(result);
    }

    @Operation(summary = "获取游客状态信息", description = "返回当前游客模式状态和相关统计信息")
    @GetMapping("/status")
    public Result<Map<String, Object>> getGuestStatus(@RequestHeader(value = "X-Guest-Session", required = false) String sessionId) {
        Map<String, Object> result = new HashMap<>();
        result.put("isGuest", true);
        result.put("hasSession", sessionId != null && !sessionId.trim().isEmpty());
        
        // 检查会话有效性
        if (sessionId != null) {
            GuestDataService.GuestSession session = guestDataService.getGuestSession(sessionId);
            result.put("sessionValid", session != null);
            if (session != null) {
                result.put("guestId", session.getGuestId());
                result.put("sessionCreatedAt", session.getCreatedAt());
                result.put("lastActiveAt", session.getLastActiveAt());
            }
        } else {
            result.put("sessionValid", false);
        }
        
        result.put("canAccessModules", new String[]{
            "最近收听", // 游客可以访问
            "浏览内容"  // 游客可以访问
        });
        result.put("restrictedModules", new String[]{
            "关注/粉丝",
            "收藏",
            "创作者中心",
            "我的作品"
        });
        
        // 游客模式下显示默认统计数据
        Map<String, Object> stats = new HashMap<>();
        stats.put("followCount", 0);
        stats.put("fansCount", 0);
        stats.put("collectCount", 0);
        stats.put("listenTime", 0);
        result.put("stats", stats);
        
        return Result.success(result);
    }

    @Operation(summary = "获取每日一句", description = "为游客用户提供每日一句功能")
    @GetMapping("/daily-sentence")
    public Result<DailySentence> getDailySentence() {
        List<DailySentence> sentences = dailySentenceService.list();
        if (sentences != null && !sentences.isEmpty()) {
            // 返回最新的每日一句
            DailySentence latestSentence = sentences.get(sentences.size() - 1);
            return Result.success(latestSentence);
        } else {
            // 如果没有每日一句，返回默认内容
            DailySentence defaultSentence = new DailySentence();
            defaultSentence.setId(0L);
            defaultSentence.setEnglish("Every day is a new beginning.");
            defaultSentence.setChinese("每天都是一个新的开始。");
            defaultSentence.setAuthor("Unknown");
            defaultSentence.setCreatedAt(LocalDateTime.now());
            return Result.success(defaultSentence);
        }
    }

    @Operation(summary = "添加游客收听历史", description = "记录游客的音频收听历史")
    @PostMapping("/history")
    public Result<Map<String, Object>> addGuestHistory(
            @RequestHeader("X-Guest-Session") String sessionId,
            @RequestParam Long audioId,
            @RequestParam String audioTitle,
            @RequestParam String teacherName
    ) {
        try {
            guestDataService.addGuestHistory(sessionId, audioId, audioTitle, teacherName);
            
            Map<String, Object> result = new HashMap<>();
            result.put("message", "收听历史记录成功");
            result.put("audioId", audioId);
            result.put("sessionId", sessionId);
            
            return Result.success(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("message", "记录收听历史失败: " + e.getMessage());
            return Result.error("记录失败");
        }
    }

    @Operation(summary = "获取游客收听历史", description = "返回游客的临时收听记录")
    @GetMapping("/history")
    public Result<Map<String, Object>> getGuestHistory(@RequestHeader("X-Guest-Session") String sessionId) {
        try {
            List<GuestDataService.GuestHistoryItem> history = guestDataService.getGuestHistory(sessionId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("sessionId", sessionId);
            result.put("historyCount", history.size());
            result.put("data", history);
            result.put("message", "游客模式下的收听记录");
            result.put("storage", "server_memory");
            result.put("autoClear", true);
            
            return Result.success(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("message", "获取收听历史失败: " + e.getMessage());
            return Result.error("获取失败");
        }
    }

    @Operation(summary = "检查接口访问权限", description = "检查指定接口是否允许游客访问")
    @PostMapping("/check-access")
    public Result<Map<String, Object>> checkAccess(@RequestParam String path) {
        Map<String, Object> result = new HashMap<>();
        
        String[] guestAllowedPaths = {
            "/api/daily-sentence",
            "/api/program", 
            "/api/audio",
            "/api/tag",
            "/api/content",
            "/api/guest"
        };
        
        boolean allowed = false;
        for (String allowedPath : guestAllowedPaths) {
            if (path.startsWith(allowedPath)) {
                allowed = true;
                break;
            }
        }
        
        result.put("path", path);
        result.put("allowed", allowed);
        result.put("isGuest", true);
        
        if (allowed) {
            result.put("message", "游客可以访问此接口");
        } else {
            result.put("message", "此接口需要登录后才能访问");
            result.put("redirectToLogin", true);
        }
        
        return Result.success(result);
    }

    @Operation(summary = "获取游客数据统计", description = "返回游客数据的统计信息（管理员用）")
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getGuestStatistics() {
        Map<String, Object> stats = guestDataService.getGuestStatistics();
        return Result.success(stats);
    }

    @Operation(summary = "清理所有游客数据", description = "手动清理所有游客数据（管理员用）")
    @PostMapping("/clear-all")
    public Result<Map<String, Object>> clearAllGuestData() {
        guestDataService.clearAllGuestData();
        
        Map<String, Object> result = new HashMap<>();
        result.put("message", "所有游客数据已清理");
        result.put("timestamp", System.currentTimeMillis());
        
        return Result.success(result);
    }
}