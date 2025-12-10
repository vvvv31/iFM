package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.*;
import com.zjsu.yyd.ifmservice.model.user.LoginRequest;
import com.zjsu.yyd.ifmservice.model.user.RegisterRequest;
import com.zjsu.yyd.ifmservice.model.user.UpdateUserRequest;
import com.zjsu.yyd.ifmservice.model.user.User;
import com.zjsu.yyd.ifmservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

// ⭐ 必须存在这个，确保 Spring 正常解析 JSON
import org.springframework.web.bind.annotation.RequestBody;

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
    public Result<User> login(@Valid @RequestBody LoginRequest req) {
        try {
            User u = userService.login(req);
            u.setPassword(null);
            return Result.success(u);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "查询用户信息",
            description = "根据 userId 查询用户信息。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "查询成功",
                            content = @Content(schema = @Schema(implementation = User.class))),
                    @ApiResponse(responseCode = "404", description = "用户不存在")
            }
    )
    @GetMapping("/me")
    public Result<User> me(@RequestParam Long userId) {
        try {
            User u = userService.getById(userId);
            u.setPassword(null);
            return Result.success(u);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "更新用户资料",
            description = "根据 userId 更新用户信息，例如昵称、头像等。",
            responses = {
                    @ApiResponse(responseCode = "200", description = "更新成功",
                            content = @Content(schema = @Schema(implementation = User.class))),
                    @ApiResponse(responseCode = "404", description = "用户不存在")
            }
    )
    @PutMapping("/update")
    public Result<User> update(
            @Schema(description = "用户ID", example = "1") @RequestParam Long userId,
            @RequestBody UpdateUserRequest req
    ) {
        try {
            User u = userService.update(userId, req);
            u.setPassword(null);
            return Result.success(u);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
