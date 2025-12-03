package com.zjsu.yyd.ifmservice.model.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "phone is required")
    // 简单手机号校验（可根据需要修改）
    @Pattern(regexp = "^[0-9]{6,20}$", message = "phone format invalid")
    private String phone;

    @NotBlank(message = "password is required")
    private String password;

    private String username;
}