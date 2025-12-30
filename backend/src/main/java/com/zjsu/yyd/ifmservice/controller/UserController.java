package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.user.LoginRequest;
import com.zjsu.yyd.ifmservice.model.user.RegisterRequest;
import com.zjsu.yyd.ifmservice.model.user.UpdateUserRequest;
import com.zjsu.yyd.ifmservice.model.user.User;
import com.zjsu.yyd.ifmservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@Tag(name = "用户模块", description = "提供注册、登录、查询、更新等用户接口")
public class UserController {

    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "用户注册",
            description = "用户通过手机号 + 密码注册账号。密码将使用 MD5 + salt 加密存储。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "注册成功",
                            content = @Content(schema = @Schema(implementation = User.class))),
                    @ApiResponse(responseCode = "400", description = "注册失败")
            }
    )
    @PostMapping("/register")
    public Result<User> register(@Valid @RequestBody RegisterRequest req) {
        try {
            User u = userService.register(req);
            u.setPassword(null);
            u.setProfile(null); // 避免profile字段导致的JSON序列化问题
            return Result.success(u);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "用户登录",
            description = "使用手机号 + 密码登录。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "登录成功",
                            content = @Content(schema = @Schema(implementation = User.class))),
                    @ApiResponse(responseCode = "401", description = "手机号或密码错误")
            }
    )
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
        try {
            User u = userService.login(req);
            
            // 模拟生成 token
            String token = "mock_token_" + System.currentTimeMillis();

            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userId", u.getUserId());
            
            // 创建用户信息的Map，避免直接返回Hibernate代理对象
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", u.getUserId());
            userInfo.put("phone", u.getPhone());
            userInfo.put("username", u.getUsername());
            userInfo.put("level", u.getLevel());
            userInfo.put("avatarUrl", u.getAvatarUrl());
            userInfo.put("createdAt", u.getCreatedAt());
            userInfo.put("updatedAt", u.getUpdatedAt());
            
            // 手动构建profile信息，避免Hibernate代理问题
            Map<String, Object> profile = new HashMap<>();
            if (u.getProfile() != null) {
                profile.put("totalListenTime", u.getProfile().getTotalListenTime());
                profile.put("fansCount", u.getProfile().getFansCount());
                profile.put("followCount", u.getProfile().getFollowCount());
                profile.put("subscribeCreatorIds", u.getProfile().getSubscribeCreatorIds());
                profile.put("collectAudioIds", u.getProfile().getCollectAudioIds());
            } else {
                // 新用户：初始化为0
                profile.put("totalListenTime", 0L);
                profile.put("fansCount", 0);
                profile.put("followCount", 0);
                profile.put("subscribeCreatorIds", new java.util.ArrayList<>());
                profile.put("collectAudioIds", new java.util.ArrayList<>());
            }
            userInfo.put("profile", profile);
            
            result.put("userInfo", userInfo);

            return Result.success(result);
        } catch (Exception e) {
            return Result.error("账号或密码错误");
        }
    }

    @Operation(
            summary = "获取当前用户状态",
            description = "根据认证信息返回当前用户状态（游客或已登录用户），并包含用户统计数据"
    )
    @GetMapping("/status")
    public Result<Map<String, Object>> getUserStatus(HttpServletRequest request) {
        // 从认证拦截器中获取用户信息
        Long userId = (Long) request.getAttribute("userId");
        Boolean isGuest = (Boolean) request.getAttribute("isGuest");
        
        Map<String, Object> result = new HashMap<>();
        
        if (Boolean.TRUE.equals(isGuest) || userId == null) {
            // 游客模式
            result.put("isGuest", true);
            result.put("userId", null);
            result.put("username", "游客");
            result.put("avatarUrl", null);
            
            // 游客模式下显示默认统计数据
            Map<String, Object> stats = new HashMap<>();
            stats.put("followCount", 0);
            stats.put("fansCount", 0);
            stats.put("collectCount", 0);
            stats.put("listenTime", 0L);
            result.put("stats", stats);
            
            result.put("message", "游客模式，仅可访问部分功能");
        } else {
            // 已登录用户
            try {
                User u = userService.getById(userId);
                result.put("isGuest", false);
                result.put("userId", userId);
                result.put("username", u.getUsername());
                result.put("avatarUrl", u.getAvatarUrl());
                result.put("level", u.getLevel());
                
                // 获取用户统计数据
                Map<String, Object> stats = new HashMap<>();
                if (u.getProfile() != null) {
                    stats.put("followCount", u.getProfile().getFollowCount());
                    stats.put("fansCount", u.getProfile().getFansCount());
                    stats.put("collectCount", u.getProfile().getCollectAudioIds().size());
                    stats.put("listenTime", u.getProfile().getTotalListenTime());
                } else {
                    // 新用户：初始化为0
                    stats.put("followCount", 0);
                    stats.put("fansCount", 0);
                    stats.put("collectCount", 0);
                    stats.put("listenTime", 0L);
                }
                result.put("stats", stats);
                
            } catch (Exception e) {
                // 用户不存在，退化为游客模式
                result.put("isGuest", true);
                result.put("userId", null);
                result.put("username", "游客");
                result.put("message", "用户不存在，已切换到游客模式");
            }
        }
        
        return Result.success(result);
    }

    @Operation(
            summary = "查询用户信息",
            description = "根据 userId 查询用户信息。"
    )
    @GetMapping("/info")
    public Result<User> getUserInfo(
            @RequestParam(required = false) Long userId,
            HttpServletRequest request
    ) {
        try {
            Long targetUserId = userId;
            
            // 如果没有指定userId，从认证信息中获取
            if (targetUserId == null) {
                targetUserId = (Long) request.getAttribute("userId");
            }
            
            if (targetUserId == null) {
                return Result.error("用户未登录");
            }
            
            User u = userService.getById(targetUserId);
            u.setPassword(null);
            u.setProfile(null); // 避免profile字段导致的JSON序列化问题
            return Result.success(u);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "更新用户资料",
            description = "根据 userId 更新用户信息，例如昵称、头像等。"
    )
    @PutMapping("/update")
    public Result<User> update(
            @RequestParam(required = false) Long userId,
            @RequestBody UpdateUserRequest req,
            HttpServletRequest request
    ) {
        try {
            Long targetUserId = userId;
            
            // 如果没有指定userId，从认证信息中获取
            if (targetUserId == null) {
                targetUserId = (Long) request.getAttribute("userId");
            }
            
            if (targetUserId == null) {
                return Result.error("用户未登录");
            }
            
            User u = userService.update(targetUserId, req);
            u.setPassword(null);
            return Result.success(u);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}