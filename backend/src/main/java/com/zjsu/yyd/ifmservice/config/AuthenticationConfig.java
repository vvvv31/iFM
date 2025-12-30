package com.zjsu.yyd.ifmservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AuthenticationConfig implements WebMvcConfigurer {

    @Bean
    public AuthenticationInterceptor authenticationInterceptor() {
        return new AuthenticationInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册认证拦截器，对需要认证的接口进行拦截
        registry.addInterceptor(authenticationInterceptor())
                .addPathPatterns("/api/userProfile/**")
                .addPathPatterns("/api/userHistory/**")
                .addPathPatterns("/api/collection/**")
                .addPathPatterns("/api/**"); // 临时：拦截所有API，后续细化
    }
}