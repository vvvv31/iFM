package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.user.UserProfile;
import com.zjsu.yyd.ifmservice.service.UserProfileService;
import jakarta.servlet.http.HttpServletRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/userProfile")
@Tag(name = "用户资料接口", description = "维护用户扩展资料，如粉丝、关注、收藏等")
public class UserProfileController {

    @Autowired
    private UserProfileService profileService;

    @Operation(summary = "创建或更新用户资料", description = "用于创建或整体更新用户资料记录")
    @PostMapping("/")
    public Map<String, Object> saveOrUpdate(@RequestBody UserProfile profile, HttpServletRequest request) {
        // 从认证信息中获取userId
        Long userId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        if (Boolean.TRUE.equals(isGuest) || userId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 401);
            result.put("message", "游客模式，无法保存用户资料");
            result.put("data", null);
            return result;
        }
        
        profile.setUserId(userId); // 确保设置正确的userId
        UserProfile savedProfile = profileService.saveOrUpdate(profile);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "保存成功");
        result.put("data", savedProfile);
        return result;
    }

    @Operation(summary = "根据 userId 查询用户资料")
    @GetMapping("/{userId}")
    public Map<String, Object> getByUserId(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            HttpServletRequest request
    ) {
        // 从认证信息中获取当前用户ID
        Long currentUserId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        // 游客模式或未登录用户只能查看自己的资料，且显示默认数据
        if (Boolean.TRUE.equals(isGuest) || currentUserId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 200);
            result.put("message", "游客模式，返回默认数据");
            result.put("data", getDefaultProfile());
            return result;
        }
        
        // 如果查询的是当前用户
        if (currentUserId.equals(userId)) {
            Optional<UserProfile> profileOpt = profileService.getByUserId(userId);
            Map<String, Object> result = new HashMap<>();
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", profileOpt.orElse(getDefaultProfile()));
            return result;
        } else {
            // 查询其他用户，返回基本信息
            Optional<UserProfile> profileOpt = profileService.getByUserId(userId);
            Map<String, Object> result = new HashMap<>();
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", profileOpt.orElse(null));
            return result;
        }
    }

    @Operation(summary = "查询当前用户资料")
    @GetMapping("/current")
    public Map<String, Object> getCurrentUserProfile(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        Map<String, Object> result = new HashMap<>();
        
        if (Boolean.TRUE.equals(isGuest) || userId == null) {
            // 游客模式，返回默认数据
            result.put("code", 200);
            result.put("message", "游客模式，返回默认数据");
            result.put("data", getDefaultProfile());
            result.put("isGuest", true);
        } else {
            // 已登录用户，查询实际数据
            Optional<UserProfile> profileOpt = profileService.getByUserId(userId);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", profileOpt.orElse(getDefaultProfile()));
            result.put("isGuest", false);
        }
        
        return result;
    }

    @Operation(summary = "查询所有用户资料（管理员接口）")
    @GetMapping("/")
    public List<UserProfile> getAll() {
        return profileService.getAll();
    }

    @Operation(summary = "删除用户资料")
    @DeleteMapping("/{userId}")
    public Map<String, Object> delete(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            HttpServletRequest request
    ) {
        Long currentUserId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        if (Boolean.TRUE.equals(isGuest) || currentUserId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 401);
            result.put("message", "游客模式，无法删除用户资料");
            return result;
        }
        
        if (!currentUserId.equals(userId)) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 403);
            result.put("message", "只能删除自己的资料");
            return result;
        }
        
        profileService.deleteByUserId(userId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "删除成功");
        return result;
    }

    @Operation(summary = "关注创作者", description = "用户订阅某个创作者（关注）")
    @PostMapping("/{userId}/subscribe/{creatorId}")
    public Map<String, Object> addSubscribe(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "被关注的创作者 ID")
            @PathVariable Long creatorId,
            HttpServletRequest request
    ) {
        Long currentUserId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        if (Boolean.TRUE.equals(isGuest) || currentUserId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 401);
            result.put("message", "游客模式，请先登录");
            return result;
        }
        
        if (!currentUserId.equals(userId)) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 403);
            result.put("message", "只能关注自己");
            return result;
        }
        
        profileService.addSubscribe(userId, creatorId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "关注成功");
        return result;
    }

    @Operation(summary = "取消关注创作者")
    @DeleteMapping("/{userId}/subscribe/{creatorId}")
    public Map<String, Object> removeSubscribe(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "被取消关注的创作者 ID")
            @PathVariable Long creatorId,
            HttpServletRequest request
    ) {
        Long currentUserId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        if (Boolean.TRUE.equals(isGuest) || currentUserId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 401);
            result.put("message", "游客模式，请先登录");
            return result;
        }
        
        if (!currentUserId.equals(userId)) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 403);
            result.put("message", "只能取消关注自己");
            return result;
        }
        
        profileService.removeSubscribe(userId, creatorId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "取消关注成功");
        return result;
    }

    @Operation(summary = "收藏音频")
    @PostMapping("/{userId}/collect/{audioId}")
    public Map<String, Object> addCollect(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "音频 ID")
            @PathVariable Long audioId,
            HttpServletRequest request
    ) {
        Long currentUserId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        if (Boolean.TRUE.equals(isGuest) || currentUserId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 401);
            result.put("message", "游客模式，请先登录");
            return result;
        }
        
        if (!currentUserId.equals(userId)) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 403);
            result.put("message", "只能收藏自己的音频");
            return result;
        }
        
        profileService.addCollect(userId, audioId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "收藏成功");
        return result;
    }

    @Operation(summary = "取消收藏音频")
    @DeleteMapping("/{userId}/collect/{audioId}")
    public Map<String, Object> removeCollect(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "音频 ID")
            @PathVariable Long audioId,
            HttpServletRequest request
    ) {
        Long currentUserId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        if (Boolean.TRUE.equals(isGuest) || currentUserId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 401);
            result.put("message", "游客模式，请先登录");
            return result;
        }
        
        if (!currentUserId.equals(userId)) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 403);
            result.put("message", "只能取消收藏自己的音频");
            return result;
        }
        
        profileService.removeCollect(userId, audioId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "取消收藏成功");
        return result;
    }

    @Operation(summary = "增加收听时长", description = "累加用户的总收听时间（单位：秒）")
    @PostMapping("/{userId}/listenTime/{seconds}")
    public Map<String, Object> addListenTime(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "增加的秒数")
            @PathVariable Long seconds,
            HttpServletRequest request
    ) {
        Long currentUserId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        if (Boolean.TRUE.equals(isGuest) || currentUserId == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 401);
            result.put("message", "游客模式，请先登录");
            return result;
        }
        
        if (!currentUserId.equals(userId)) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 403);
            result.put("message", "只能增加自己的收听时长");
            return result;
        }
        
        profileService.addListenTime(userId, seconds);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "收听时长更新成功");
        return result;
    }

    /**
     * 获取默认的用户资料（用于游客模式或新用户）
     */
    private UserProfile getDefaultProfile() {
        UserProfile defaultProfile = new UserProfile();
        defaultProfile.setTotalListenTime(0L);
        defaultProfile.setFansCount(0);
        defaultProfile.setFollowCount(0);
        defaultProfile.setSubscribeCreatorIds(new java.util.ArrayList<>());
        defaultProfile.setCollectAudioIds(new java.util.ArrayList<>());
        return defaultProfile;
    }
}