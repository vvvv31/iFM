package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.user.LoginRequest;
import com.zjsu.yyd.ifmservice.model.user.RegisterRequest;
import com.zjsu.yyd.ifmservice.model.user.User;
import com.zjsu.yyd.ifmservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(
        name = "认证接口 Auth",
        description = "用户认证相关接口：注册、登录、验证码登录、退出、找回密码等"
)
public class AuthController {

    @Autowired
    private UserService userService;

    @Operation(
            summary = "用户注册",
            description = "用户通过注册信息创建新账号"
    )
    @PostMapping("/register")
    public Result<User> register(
            @RequestBody(
                    description = "注册请求参数",
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody RegisterRequest request
    ) {
        try {
            User user = userService.register(request);
            return Result.success(user);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "账号密码登录",
            description = "用户使用账号和密码登录，返回 token 与用户信息"
    )
    @PostMapping("/login")
    public Result<Map<String, Object>> login(
            @RequestBody(
                    description = "登录请求参数（账号 + 密码）",
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody LoginRequest request
    ) {
        try {
            User u = userService.login(request);

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
            }
            userInfo.put("profile", profile);
            
            result.put("userInfo", userInfo);

            return Result.success(result);
        } catch (Exception e) {
            return Result.error("账号或密码错误");
        }
    }

    @Operation(
            summary = "手机号验证码登录",
            description = "用户通过手机号 + 验证码登录（测试验证码固定为 123456）"
    )
    @PostMapping("/login/phone")
    public Result<Map<String, Object>> loginByPhone(
            @RequestBody(
                    description = """
                            请求参数说明：
                            phone：手机号
                            code：验证码（测试固定为 123456）
                            """,
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> request
    ) {
        String phone = request.get("phone");
        String code = request.get("code");

        if (!"123456".equals(code)) {
            return Result.error("验证码错误");
        }

        User u = userService.findByPhone(phone);
        if (u == null) {
            u = new User();
            u.setUserId(0L);
            u.setPhone(phone);
            u.setUsername("用户" + phone.substring(phone.length() - 4));
            u.setPassword("123456");
            u = userService.save(u);
        }

        String token = "mock_token_" + System.currentTimeMillis();

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", u.getUserId());
        result.put("userInfo", u);

        return Result.success(result);
    }

    @Operation(
            summary = "退出登录",
            description = "用户退出登录，需要在请求头中携带 Authorization token"
    )
    @PostMapping("/logout")
    public Result<Void> logout(
            @Parameter(
                    description = "登录后获取的 token",
                    required = true,
                    example = "mock_token_1690000000000"
            )
            @RequestHeader("Authorization") String token
    ) {
        return Result.success(null);
    }

    @Operation(
            summary = "刷新 Token",
            description = "使用旧 token 换取新的 token"
    )
    @PostMapping("/refresh")
    public Result<Map<String, String>> refreshToken(
            @RequestBody(
                    description = "请求体中携带旧 token",
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> request
    ) {
        String oldToken = request.get("token");

        String newToken = "mock_token_" + System.currentTimeMillis();

        Map<String, String> result = new HashMap<>();
        result.put("token", newToken);

        return Result.success(result);
    }

    @Operation(
            summary = "忘记密码 / 重置密码",
            description = "通过手机号 + 验证码重置密码（测试验证码固定为 123456）"
    )
    @PostMapping("/forgot-password")
    public Result<Void> forgotPassword(
            @RequestBody(
                    description = """
                            请求参数：
                            phone：手机号
                            code：验证码（123456）
                            newPassword：新密码
                            """,
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> request
    ) {
        String phone = request.get("phone");
        String code = request.get("code");
        String newPassword = request.get("newPassword");

        if (!"123456".equals(code)) {
            return Result.error("验证码错误");
        }

        boolean success = userService.updatePassword(phone, newPassword);
        return success ? Result.success(null) : Result.error("用户不存在");
    }

    @Operation(
            summary = "发送手机验证码",
            description = "向指定手机号发送验证码（当前为模拟发送）"
    )
    @PostMapping("/send-code")
    public Result<Void> sendCode(
            @RequestBody(
                    description = """
                            请求参数：
                            phone：手机号
                            type：业务类型（login / reset）
                            """,
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> request
    ) {
        String phone = request.get("phone");
        String type = request.get("type");

        System.out.println("发送验证码到：" + phone + "，类型：" + type + "，验证码：123456");

        return Result.success(null);
    }
}
