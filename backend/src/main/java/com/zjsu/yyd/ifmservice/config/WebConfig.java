package com.zjsu.yyd.ifmservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "http://192.168.1.*",
                        "file://*"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ✅ 配置前端静态资源访问
        registry.addResourceHandler("/**")
                .addResourceLocations("file:d:/SE/github/iFM-backend/iFM/Frontend/");

        // ✅ 配置上传文件访问路径 - 使用绝对路径
        String uploadsDir = "d:/SE/github/iFM-backend/iFM/backend/uploads";

        System.out.println("=== WebConfig 资源处理配置 ===");
        System.out.println("上传目录绝对路径: " + uploadsDir);
        System.out.println("映射 /uploads/** -> file:" + uploadsDir + "/");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsDir + "/");

        // 配置静态资源
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");

        System.out.println("✅ 资源处理器配置完成");
    }
}