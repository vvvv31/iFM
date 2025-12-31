package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.collection.Collection;
import com.zjsu.yyd.ifmservice.service.CollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collection")
@Tag(name = "收藏模块", description = "提供节目/集数收藏、取消收藏、收藏列表等接口")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    /**
     * 从请求中获取用户ID
     * 实际项目中应该从JWT Token或Session中获取
     */
    private Long getUserIdFromRequest(HttpServletRequest request) {
        // 方案1: 从请求头获取用户ID
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            try {
                return Long.parseLong(userIdHeader);
            } catch (NumberFormatException e) {
                // 记录日志
            }
        }

        // 方案2: 从Authorization头中获取（如果有JWT）
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // 这里应该解析JWT Token获取用户ID
            // Long userId = jwtService.extractUserId(token);
            // return userId;
        }

        // 方案3: 从Cookie获取（如果使用Session）
        // 这里为了简化演示，暂时使用固定用户ID
        // 在实际项目中，你应该实现完整的用户认证逻辑

        return 1L; // 临时使用固定用户ID，请在实际项目中替换
    }

    @Operation(
            summary = "收藏节目/集数",
            description = "收藏指定ID的节目或集数"
    )
    @PostMapping("/add")
    public Result<Void> addCollection(
            @RequestParam Long targetId,
            @RequestParam String targetType,
            HttpServletRequest request) {
        try {
            Long currentUserId = getUserIdFromRequest(request);
            boolean success = collectionService.addCollection(currentUserId, targetId, targetType);
            if (success) {
                return Result.success("收藏成功", null);
            } else {
                return Result.error("已收藏过该内容");
            }
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "取消收藏",
            description = "取消收藏指定ID的节目或集数"
    )
    @PostMapping("/remove")
    public Result<Void> removeCollection(
            @RequestParam Long targetId,
            @RequestParam String targetType,
            HttpServletRequest request) {
        try {
            Long currentUserId = getUserIdFromRequest(request);
            boolean success = collectionService.removeCollection(currentUserId, targetId, targetType);
            if (success) {
                return Result.success("取消收藏成功", null);
            } else {
                return Result.error("未收藏该内容");
            }
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "检查是否收藏",
            description = "检查用户是否收藏了指定的节目或集数"
    )
    @GetMapping("/check")
    public Result<Boolean> checkCollection(
            @RequestParam Long targetId,
            @RequestParam String targetType,
            HttpServletRequest request) {
        try {
            Long currentUserId = getUserIdFromRequest(request);
            boolean isCollected = collectionService.checkCollection(currentUserId, targetId, targetType);
            return Result.success(isCollected);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取我的收藏列表",
            description = "获取当前登录用户的收藏列表"
    )
    @GetMapping("/list")
    public Result<List<Collection>> getCollectionList(HttpServletRequest request) {
        try {
            Long currentUserId = getUserIdFromRequest(request);
            List<Collection> collectionList = collectionService.getCollectionList(currentUserId);
            return Result.success(collectionList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取收藏的节目列表",
            description = "获取当前登录用户收藏的节目列表"
    )
    @GetMapping("/program/list")
    public Result<List<Collection>> getCollectedProgramList(HttpServletRequest request) {
        try {
            Long currentUserId = getUserIdFromRequest(request);
            List<Collection> programList = collectionService.getProgramCollectionList(currentUserId);
            return Result.success(programList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取收藏的集数列表",
            description = "获取当前登录用户收藏的集数列表"
    )
    @GetMapping("/episode/list")
    public Result<List<Collection>> getCollectedEpisodeList(HttpServletRequest request) {
        try {
            Long currentUserId = getUserIdFromRequest(request);
            List<Collection> episodeList = collectionService.getEpisodeCollectionList(currentUserId);
            return Result.success(episodeList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}