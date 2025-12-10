package com.zjsu.yyd.ifmservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置静态资源访问路径，将/uploads/**映射到文件系统的上传目录
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:d:/02_Academic/ifm-service/uploads/");
    }
}