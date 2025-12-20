package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.collection.Collection;
import com.zjsu.yyd.ifmservice.service.CollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    @Operation(
            summary = "收藏节目/集数",
            description = "收藏指定ID的节目或集数"
    )
    @PostMapping("/add")
    public Result<Void> addCollection(
            @RequestParam Long targetId,
            @RequestParam String targetType) {
        try {
            // 这里应该从请求头或上下文中获取当前登录用户的ID，暂时使用模拟数据
            Long currentUserId = 1L; // 模拟当前登录用户ID
            collectionService.addCollection(currentUserId, targetId, targetType);
            return Result.success(null);
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
            @RequestParam String targetType) {
        try {
            // 这里应该从请求头或上下文中获取当前登录用户的ID，暂时使用模拟数据
            Long currentUserId = 1L; // 模拟当前登录用户ID
            collectionService.removeCollection(currentUserId, targetId, targetType);
            return Result.success(null);
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
            @RequestParam String targetType) {
        try {
            // 这里应该从请求头或上下文中获取当前登录用户的ID，暂时使用模拟数据
            Long currentUserId = 1L; // 模拟当前登录用户ID
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
    public Result<List<Collection>> getCollectionList() {
        try {
            // 这里应该从请求头或上下文中获取当前登录用户的ID，暂时使用模拟数据
            Long currentUserId = 1L; // 模拟当前登录用户ID
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
    public Result<List<Collection>> getCollectedProgramList() {
        try {
            // 这里应该从请求头或上下文中获取当前登录用户的ID，暂时使用模拟数据
            Long currentUserId = 1L; // 模拟当前登录用户ID
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
    public Result<List<Collection>> getCollectedEpisodeList() {
        try {
            // 这里应该从请求头或上下文中获取当前登录用户的ID，暂时使用模拟数据
            Long currentUserId = 1L; // 模拟当前登录用户ID
            List<Collection> episodeList = collectionService.getEpisodeCollectionList(currentUserId);
            return Result.success(episodeList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}