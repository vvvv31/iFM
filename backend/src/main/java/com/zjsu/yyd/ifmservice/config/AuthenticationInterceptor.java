package com.zjsu.yyd.ifmservice.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

/**
 * 用户认证拦截器 - 支持游客模式
 * 
 * 功能：
 * 1. 解析 Authorization 头中的 token
 * 2. 支持游客模式（无 token 情况下允许访问部分接口）
 * 3. 将用户信息传递给后续处理器
 */
public class AuthenticationInterceptor implements HandlerInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String IS_GUEST_HEADER = "X-Is-Guest";
    
    // 游客模式允许访问的接口
    private static final String[] GUEST_ALLOWED_PATHS = {
        "/api/daily-sentence",
        "/api/program", 
        "/api/audio",
        "/api/tag",
        "/api/content",
        // 添加认证相关接口
        "/api/auth/register",
        "/api/auth/login",
        "/api/auth/test-token"
    };

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // 允许 CORS 预检请求通过
        if ("OPTIONS".equalsIgnoreCase(method)) {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
            response.setStatus(HttpServletResponse.SC_OK);
            return true;
        }
        
        // 检查是否为游客模式允许访问的接口
        if (isGuestAllowedPath(path)) {
            // 游客模式：设置标识但不要求登录
            request.setAttribute("isGuest", true);
            request.setAttribute("userId", null);
            return true;
        }

        // 获取 Authorization 头
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            // 验证 token（当前使用简单验证，后续可扩展 JWT）
            if (isValidToken(token)) {
                Long userId = extractUserIdFromToken(token);
                request.setAttribute("userId", userId);
                request.setAttribute("isGuest", false);
                return true;
            } else {
                // Token 无效，返回 401
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"code\":401,\"message\":\"Token无效或已过期\"}");
                return false;
            }
        }
        
        // 无 token 且不是游客允许的接口，返回 401
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"code\":401,\"message\":\"请先登录\"}");
        return false;
    }

    /**
     * 检查路径是否为游客模式允许
     */
    private boolean isGuestAllowedPath(String path) {
        for (String allowedPath : GUEST_ALLOWED_PATHS) {
            if (path.startsWith(allowedPath)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 验证 token 是否有效
     * 当前实现：简单的格式验证
     * 后续可扩展为 JWT 验证
     */
    private boolean isValidToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }
        
        // 当前的 mock token 格式：mock_token_时间戳
        return token.startsWith("mock_token_");
    }

    /**
     * 从 token 中提取用户ID
     */
    private Long extractUserIdFromToken(String token) {
        // 当前 token 格式：mock_token_时间戳
        // 实际项目中应该解析 JWT 获取用户信息
        try {
            String[] parts = token.split("_");
            if (parts.length >= 3) {
                // 提取时间戳部分作为简单标识（实际应该存储用户ID）
                long timestamp = Long.parseLong(parts[2]);
                // 简单hash映射到用户ID范围
                return Math.abs(timestamp % 1000) + 1L;
            }
        } catch (Exception e) {
            // 解析失败，返回默认用户ID
        }
        return 1L; // 默认用户ID
    }
}