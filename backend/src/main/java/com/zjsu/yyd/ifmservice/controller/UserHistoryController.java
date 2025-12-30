package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.user.UserHistory;
import com.zjsu.yyd.ifmservice.service.UserHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/history")
@Tag(name = "用户播放历史接口")
public class UserHistoryController {

    private final UserHistoryService userHistoryService;

    public UserHistoryController(UserHistoryService userHistoryService) {
        this.userHistoryService = userHistoryService;
    }

    // ==================== 新增 ====================

    @Operation(summary = "新增播放历史")
    @PostMapping
    public Result<UserHistory> create(
            @RequestParam Long userId,
            @RequestParam Long audioId
    ) {
        return Result.success(userHistoryService.createHistory(userId, audioId));
    }

    // ==================== 查询 ====================

    @Operation(summary = "根据ID查询历史")
    @GetMapping("/{id}")
    public Result<UserHistory> getById(@PathVariable Long id) {
        return Result.success(userHistoryService.getById(id));
    }

    @Operation(summary = "查询用户播放历史")
    @GetMapping("/user/{userId}")
    public Result<List<UserHistory>> listByUser(@PathVariable Long userId) {
        return Result.success(userHistoryService.listByUserId(userId));
    }

    @Operation(summary = "查询用户某音频播放记录")
    @GetMapping("/user/{userId}/audio/{audioId}")
    public Result<List<UserHistory>> listByUserAndAudio(
            @PathVariable Long userId,
            @PathVariable Long audioId
    ) {
        return Result.success(
                userHistoryService.listByUserAndAudio(userId, audioId)
        );
    }

    // ==================== 修改 ====================

    @Operation(summary = "修改播放时间")
    @PutMapping("/{id}")
    public Result<UserHistory> updateTime(
            @PathVariable Long id,
            @RequestParam LocalDateTime listenedAt
    ) {
        return Result.success(
                userHistoryService.updateListenedAt(id, listenedAt)
        );
    }

    // ==================== 删除 ====================

    @Operation(summary = "删除一条历史")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userHistoryService.deleteById(id);
        return Result.success(null);
    }

    @Operation(summary = "删除用户所有历史")
    @DeleteMapping("/user/{userId}")
    public Result<Void> deleteByUser(@PathVariable Long userId) {
        userHistoryService.deleteByUserId(userId);
        return Result.success(null);
    }
}
