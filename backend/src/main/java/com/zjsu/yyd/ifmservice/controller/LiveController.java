package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.live.LiveChat;
import com.zjsu.yyd.ifmservice.model.live.LiveRoom;
import com.zjsu.yyd.ifmservice.service.LiveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/live")
@Tag(name = "直播模块", description = "提供直播间管理、加入、聊天、查询等接口")
public class LiveController {

    private final LiveService liveService;

    public LiveController(LiveService liveService) {
        this.liveService = liveService;
    }

    @Operation(
            summary = "创建直播间",
            description = "由主播创建直播间，返回直播间信息。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "创建成功",
                            content = @Content(schema = @Schema(implementation = LiveRoom.class))),
                    @ApiResponse(responseCode = "400", description = "创建失败")
            }
    )
    @PostMapping("/create")
    public Result<LiveRoom> create(
            @Schema(description = "主播用户ID", example = "1") @RequestParam Long userId,
            @Schema(description = "直播间标题", example = "英语口语练习") @RequestParam String title,
            @Schema(description = "直播间描述", example = "适合中级英语学习者") @RequestParam String desc
    ) {
        return Result.success(liveService.createLive(userId, title, desc));
    }

    @Operation(
            summary = "开始直播",
            description = "将直播间状态设置为‘直播中’，记录开始时间。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "操作成功"),
                    @ApiResponse(responseCode = "404", description = "直播间不存在")
            }
    )
    @PostMapping("/{liveId}/start")
    public Result<Void> start(
            @Schema(description = "直播间ID", example = "1") @PathVariable Long liveId
    ) {
        liveService.startLive(liveId);
        return Result.success(null);
    }

    @Operation(
            summary = "加入直播间",
            description = "用户加入直播间，默认角色为听众。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "加入成功"),
                    @ApiResponse(responseCode = "404", description = "直播间不存在")
            }
    )
    @PostMapping("/{liveId}/join")
    public Result<Void> join(
            @Schema(description = "直播间ID", example = "1") @PathVariable Long liveId,
            @Schema(description = "用户ID", example = "2") @RequestParam Long userId
    ) {
        liveService.joinLive(liveId, userId, 0);
        return Result.success(null);
    }

    @Operation(
            summary = "发送聊天消息",
            description = "用户在直播间发送聊天消息。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "发送成功",
                            content = @Content(schema = @Schema(implementation = LiveChat.class))),
                    @ApiResponse(responseCode = "404", description = "直播间不存在")
            }
    )
    @PostMapping("/{liveId}/chat")
    public Result<LiveChat> chat(
            @Schema(description = "直播间ID", example = "1") @PathVariable Long liveId,
            @Schema(description = "用户ID", example = "2") @RequestParam Long userId,
            @Schema(description = "消息内容", example = "大家好") @RequestParam String content
    ) {
        return Result.success(liveService.sendChat(liveId, userId, content));
    }

    // ==================== 新增接口 ====================

    @Operation(
            summary = "显示所有直播间",
            description = "返回系统中所有直播间信息。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "查询成功",
                            content = @Content(schema = @Schema(implementation = LiveRoom.class)))
            }
    )
    @GetMapping("/all")
    public Result<List<LiveRoom>> getAllLives() {
        return Result.success(liveService.getAllLives());
    }

    @Operation(
            summary = "根据用户ID查找直播间",
            description = "返回用户创建或参与的直播间列表。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "查询成功",
                            content = @Content(schema = @Schema(implementation = LiveRoom.class)))
            }
    )
    @GetMapping("/byUser")
    public Result<List<LiveRoom>> getLivesByUserId(
            @Schema(description = "用户ID", example = "1") @RequestParam Long userId
    ) {
        return Result.success(liveService.getLivesByUserId(userId));
    }

    @Operation(
            summary = "获取直播间聊天记录",
            description = "返回指定直播间的所有聊天记录。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "查询成功",
                            content = @Content(schema = @Schema(implementation = LiveChat.class))),
                    @ApiResponse(responseCode = "404", description = "直播间不存在")
            }
    )
    @GetMapping("/{liveId}/chats")
    public Result<List<LiveChat>> getChatsByLiveId(
            @Schema(description = "直播间ID", example = "1") @PathVariable Long liveId
    ) {
        return Result.success(liveService.getChatsByLiveId(liveId));
    }

    @Operation(
            summary = "获取直播间所有加入用户ID",
            description = "返回指定直播间所有加入的用户ID列表。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "查询成功"),
                    @ApiResponse(responseCode = "404", description = "直播间不存在")
            }
    )
    @GetMapping("/{liveId}/members")
    public Result<List<Long>> getMembersByLiveId(
            @Schema(description = "直播间ID", example = "1") @PathVariable Long liveId
    ) {
        return Result.success(liveService.getMembersByLiveId(liveId));
    }
}
