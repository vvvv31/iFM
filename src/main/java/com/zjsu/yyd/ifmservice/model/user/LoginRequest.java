package com.zjsu.yyd.ifmservice.model.user;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "phone is required")
    private String phone;

    @NotBlank(message = "password is required")
    private String password;

    // Getter and Setter methods
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
