package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.user.UserProfile;
import com.zjsu.yyd.ifmservice.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/userProfile")
@Tag(name = "用户资料接口", description = "维护用户扩展资料，如粉丝、关注、收藏等")
public class UserProfileController {

    @Autowired
    private UserProfileService profileService;

    @Operation(summary = "创建或更新用户资料", description = "用于创建或整体更新用户资料记录")
    @PostMapping("/")
    public UserProfile saveOrUpdate(@RequestBody UserProfile profile) {
        return profileService.saveOrUpdate(profile);
    }

    @Operation(summary = "根据 userId 查询用户资料")
    @GetMapping("/{userId}")
    public Optional<UserProfile> getByUserId(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId
    ) {
        return profileService.getByUserId(userId);
    }

    @Operation(summary = "查询所有用户资料")
    @GetMapping("/")
    public List<UserProfile> getAll() {
        return profileService.getAll();
    }

    @Operation(summary = "删除用户资料")
    @DeleteMapping("/{userId}")
    public void delete(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId
    ) {
        profileService.deleteByUserId(userId);
    }

    @Operation(summary = "关注创作者", description = "用户订阅某个创作者（关注）")
    @PostMapping("/{userId}/subscribe/{creatorId}")
    public void addSubscribe(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "被关注的创作者 ID")
            @PathVariable Long creatorId
    ) {
        profileService.addSubscribe(userId, creatorId);
    }

    @Operation(summary = "取消关注创作者")
    @DeleteMapping("/{userId}/subscribe/{creatorId}")
    public void removeSubscribe(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "被取消关注的创作者 ID")
            @PathVariable Long creatorId
    ) {
        profileService.removeSubscribe(userId, creatorId);
    }

    @Operation(summary = "收藏音频")
    @PostMapping("/{userId}/collect/{audioId}")
    public void addCollect(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "音频 ID")
            @PathVariable Long audioId
    ) {
        profileService.addCollect(userId, audioId);
    }

    @Operation(summary = "取消收藏音频")
    @DeleteMapping("/{userId}/collect/{audioId}")
    public void removeCollect(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "音频 ID")
            @PathVariable Long audioId
    ) {
        profileService.removeCollect(userId, audioId);
    }

    @Operation(summary = "增加收听时长", description = "累加用户的总收听时间（单位：秒）")
    @PostMapping("/{userId}/listenTime/{seconds}")
    public void addListenTime(
            @Parameter(description = "用户 ID")
            @PathVariable Long userId,
            @Parameter(description = "增加的秒数")
            @PathVariable Long seconds
    ) {
        profileService.addListenTime(userId, seconds);
    }
}
