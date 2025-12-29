package com.zjsu.yyd.ifmservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 配置CORS，允许所有来源访问API
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // 配置静态资源访问路径，将/uploads/**映射到文件系统的上传目录
//        registry.addResourceHandler("/uploads/**")
//                .addResourceLocations("file:d:/02_Academic/ifm-service/uploads/");
//    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {//修改为自己文件的路径
        registry.addResourceHandler("/**")
                .addResourceLocations("file:d:/SE/github/iFM-backend/iFM/Frontend/");
    }
}