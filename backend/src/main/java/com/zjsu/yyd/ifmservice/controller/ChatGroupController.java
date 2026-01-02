package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroup;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupMember;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupResource;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupCreateRequest;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupJoinRequest;
import com.zjsu.yyd.ifmservice.service.ChatGroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/group")
//@CrossOrigin(origins = {"http://localhost", "*"})
@Tag(name = "群聊模块", description = "提供群创建、查询、加入、解散、群组成员和群组资源管理相关接口")
public class ChatGroupController {

    private final ChatGroupService service;

    public ChatGroupController(ChatGroupService service) {
        this.service = service;
    }

    @Operation(
            summary = "创建群聊",
            description = "创建一个新的聊天群,创建者将自动成为群主并加入群聊",
            responses = {
                    @ApiResponse(responseCode = "200", description = "创建成功", content = @Content(schema = @Schema(implementation = ChatGroup.class))),
                    @ApiResponse(responseCode = "400", description = "请求参数错误", content = @Content),
                    @ApiResponse(responseCode = "500", description = "服务器错误", content = @Content)
            }
    )
    @PostMapping("/create")
    public Result<ChatGroup> create(@RequestBody ChatGroupCreateRequest req) {
        try {
            if (req.getGroupName() == null || req.getGroupName().trim().isEmpty()) {
                return Result.error("群名不能为空");
            }
            if (req.getOwnerId() == null) {
                return Result.error("群主ID不能为空");
            }

            ChatGroup g = service.createGroup(
                    req.getGroupName(),
                    req.getDescription(),
                    req.getOwnerId(),
                    req.getInviteCode()
            );
            return Result.success(g);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("创建失败: " + e.getMessage());
        }
    }

    @Operation(
            summary = "获取群聊信息",
            description = "根据群组ID获取群聊的基础信息,包括群名、描述、群主ID、邀请码、创建时间等",
            responses = {
                    @ApiResponse(responseCode = "200", description = "查询成功", content = @Content(schema = @Schema(implementation = ChatGroup.class))),
                    @ApiResponse(responseCode = "404", description = "群聊不存在", content = @Content)
            }
    )
    @GetMapping("/{groupId}")
    public Result<ChatGroup> info(
            @Parameter(description = "群组ID", example = "1") @PathVariable Long groupId) {
        try {
            return Result.success(service.getGroup(groupId));
        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @Operation(
            summary = "通过邀请码加入群聊",
            description = "用户通过群邀请码加入指定群聊,成功后用户将成为该群成员",
            responses = {
                    @ApiResponse(responseCode = "200", description = "加入成功", content = @Content),
                    @ApiResponse(responseCode = "400", description = "邀请码错误或群不存在", content = @Content)
            }
    )
    @PostMapping("/join")
    public Result<String> join(@RequestBody ChatGroupJoinRequest req) {
        try {
            service.joinByInviteCode(req.getInviteCode(), req.getUserId());
            return Result.success("加入成功");
        } catch (Exception e) {
            return Result.error("加入失败: " + e.getMessage());
        }
    }

    @Operation(
            summary = "解散群聊",
            description = "群主解散群聊,仅群主有权限执行该操作",
            responses = {
                    @ApiResponse(responseCode = "200", description = "解散成功", content = @Content),
                    @ApiResponse(responseCode = "403", description = "非群主无权限", content = @Content),
                    @ApiResponse(responseCode = "404", description = "群聊不存在", content = @Content)
            }
    )
    @DeleteMapping("/{groupId}")
    public Result<String> delete(
            @Parameter(description = "群组ID", example = "1") @PathVariable Long groupId,
            @Parameter(description = "操作用户ID", example = "1001") @RequestParam Long userId) {
        try {
            service.deleteGroup(groupId, userId);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    @Operation(
            summary = "获取群组成员列表",
            description = "根据群组ID获取该群的所有成员信息,包括用户ID和角色",
            responses = {
                    @ApiResponse(responseCode = "200", description = "查询成功", content = @Content(schema = @Schema(implementation = ChatGroupMember.class))),
                    @ApiResponse(responseCode = "404", description = "群组不存在", content = @Content)
            }
    )
    @GetMapping("/{groupId}/members")
    public Result<List<ChatGroupMember>> members(
            @Parameter(description = "群组ID", example = "1") @PathVariable Long groupId) {
        try {
            List<ChatGroupMember> members = service.getMembersByGroupId(groupId);
            return Result.success(members);
        } catch (Exception e) {
            return Result.error("查询成员失败: " + e.getMessage());
        }
    }

    @Operation(
            summary = "为群组添加资源",
            description = "向指定群组添加一个节目/资源关联",
            responses = {
                    @ApiResponse(responseCode = "200", description = "添加成功", content = @Content(schema = @Schema(implementation = ChatGroupResource.class))),
                    @ApiResponse(responseCode = "400", description = "资源已存在或参数错误", content = @Content)
            }
    )
    @PostMapping("/{groupId}/resource")
    public Result<ChatGroupResource> addResource(
            @Parameter(description = "群组ID", example = "1") @PathVariable Long groupId,
            @Parameter(description = "节目/资源ID", example = "2001") @RequestParam Long programId) {
        try {
            ChatGroupResource resource = service.addResourceToGroup(groupId, programId);
            return Result.success(resource);
        } catch (Exception e) {
            return Result.error("添加资源失败: " + e.getMessage());
        }
    }

    @Operation(
            summary = "删除群组资源",
            description = "删除群组中已关联的节目/资源",
            responses = {
                    @ApiResponse(responseCode = "200", description = "删除成功", content = @Content),
                    @ApiResponse(responseCode = "404", description = "资源不存在", content = @Content)
            }
    )
    @DeleteMapping("/{groupId}/resource")
    public Result<String> removeResource(
            @Parameter(description = "群组ID", example = "1") @PathVariable Long groupId,
            @Parameter(description = "节目/资源ID", example = "2001") @RequestParam Long programId) {
        try {
            service.removeResourceFromGroup(groupId, programId);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除资源失败: " + e.getMessage());
        }
    }

    @Operation(
            summary = "获取群组资源列表",
            description = "查询指定群组下已关联的所有节目/资源",
            responses = {
                    @ApiResponse(responseCode = "200", description = "查询成功", content = @Content(schema = @Schema(implementation = ChatGroupResource.class))),
                    @ApiResponse(responseCode = "404", description = "群组不存在", content = @Content)
            }
    )
    @GetMapping("/{groupId}/resources")
    public Result<List<ChatGroupResource>> resources(
            @Parameter(description = "群组ID", example = "1") @PathVariable Long groupId) {
        try {
            List<ChatGroupResource> resources = service.getResourcesByGroupId(groupId);
            return Result.success(resources);
        } catch (Exception e) {
            return Result.error("查询资源失败: " + e.getMessage());
        }
    }

    @Operation(summary = "获取所有群组", description = "获取系统中所有的群组列表")
    @GetMapping("/all")
    public Result<List<ChatGroup>> getAllGroups() {
        try {
            List<ChatGroup> groups = service.getAllGroups();
            return Result.success(groups);
        } catch (Exception e) {
            return Result.error("获取群组列表失败: " + e.getMessage());
        }
    }

    @Operation(summary = "获取用户已加入的群组", description = "获取指定用户已加入的所有群组")
    @GetMapping("/user/{userId}/joined")
    public Result<List<ChatGroup>> getUserJoinedGroups(
            @Parameter(description = "用户ID", example = "1") @PathVariable Long userId) {
        try {
            List<ChatGroup> groups = service.getUserJoinedGroups(userId);
            return Result.success(groups);
        } catch (Exception e) {
            return Result.error("获取用户群组失败: " + e.getMessage());
        }
    }

    @Operation(summary = "退出群组", description = "普通成员退出群组")
    @PostMapping("/{groupId}/leave")
    public Result<String> leaveGroup(
            @Parameter(description = "群组ID", example = "1") @PathVariable Long groupId,
            @RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            service.leaveGroup(groupId, userId);
            return Result.success("退出群组成功");
        } catch (Exception e) {
            return Result.error("退出群组失败: " + e.getMessage());
        }
    }
}