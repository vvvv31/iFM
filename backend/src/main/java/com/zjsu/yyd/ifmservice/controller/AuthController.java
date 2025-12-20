package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.user.LoginRequest;
import com.zjsu.yyd.ifmservice.model.user.RegisterRequest;
import com.zjsu.yyd.ifmservice.model.user.User;
import com.zjsu.yyd.ifmservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "认证接口", description = "提供用户注册、登录、退出等认证功能")
public class AuthController {

    @Autowired
    private UserService userService;

    @Operation(summary = "注册", description = "用户注册接口")
    @PostMapping("/register")
    public Result<User> register(@RequestBody RegisterRequest request) {
        // 调用服务层注册用户
        try {
            User user = userService.register(request);
            return Result.success(user);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(summary = "账号密码登录", description = "用户账号密码登录接口")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginRequest request) {
        // 调用服务层登录用户
        try {
            User u = userService.login(request);
            // 模拟生成token
            String token = "mock_token_" + System.currentTimeMillis();
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userId", u.getUserId());
            result.put("userInfo", u);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error("账号或密码错误");
        }
    }

    @Operation(summary = "手机号验证码登录", description = "用户手机号验证码登录接口")
    @PostMapping("/login/phone")
    public Result<Map<String, Object>> loginByPhone(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String code = request.get("code");

        // 验证验证码（实际项目中应该从redis获取并验证）
        if (!"123456".equals(code)) {
            return Result.error("验证码错误");
        }

        // 查找或创建用户
        User u = userService.findByPhone(phone);
        if (u == null) {
            u = new User();
            u.setUserId(0L); // 临时ID，保存时会自动生成
            u.setPhone(phone);
            u.setUsername("用户" + phone.substring(7));
            u.setPassword("123456"); // 默认密码
            u = userService.save(u);
        }

        // 生成token
        String token = "mock_token_" + System.currentTimeMillis();
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", u.getUserId());
        result.put("userInfo", u);
        return Result.success(result);
    }

    @Operation(summary = "退出登录", description = "用户退出登录接口")
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader("Authorization") String token) {
        // 实际项目中应该将token加入黑名单
        return Result.success(null);
    }

    @Operation(summary = "刷新token", description = "刷新用户token")
    @PostMapping("/refresh")
    public Result<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
        String oldToken = request.get("token");
        // 实际项目中应该验证旧token并生成新token
        String newToken = "mock_token_" + System.currentTimeMillis();
        Map<String, String> result = new HashMap<>();
        result.put("token", newToken);
        return Result.success(result);
    }

    @Operation(summary = "忘记密码", description = "用户忘记密码，通过手机号验证码重置")
    @PostMapping("/forgot-password")
    public Result<Void> forgotPassword(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String code = request.get("code");
        String newPassword = request.get("newPassword");

        // 验证验证码
        if (!"123456".equals(code)) {
            return Result.error("验证码错误");
        }

        // 更新密码
        boolean success = userService.updatePassword(phone, newPassword);
        if (success) {
            return Result.success(null);
        } else {
            return Result.error("用户不存在");
        }
    }

    @Operation(summary = "发送验证码", description = "发送手机验证码")
    @PostMapping("/send-code")
    public Result<Void> sendCode(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String type = request.get("type"); // "login" 或 "reset"

        // 实际项目中应该调用短信服务发送验证码
        System.out.println("发送验证码到" + phone + ", 类型：" + type + ", 验证码：123456");
        return Result.success(null);
    }
}