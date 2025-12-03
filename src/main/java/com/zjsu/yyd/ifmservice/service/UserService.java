package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.user.LoginRequest;
import com.zjsu.yyd.ifmservice.model.user.RegisterRequest;
import com.zjsu.yyd.ifmservice.model.user.UpdateUserRequest;
import com.zjsu.yyd.ifmservice.model.user.User;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private static final String SALT = "com.ifm";

    /** MD5 加密（SALT + raw） */
    private String encryptPassword(String raw) {
        if (raw == null) raw = "";
        return DigestUtils.md5DigestAsHex((SALT + raw).getBytes());
    }

    public User register(RegisterRequest req) {
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new RuntimeException("手机号已注册");
        }

        User user = new User();
        user.setPhone(req.getPhone());
        user.setUsername(req.getUsername());
        user.setPassword(encryptPassword(req.getPassword()));
        user.setLevel("A1");

        return userRepository.save(user);
    }

    public User login(LoginRequest req) {
        Optional<User> opt = userRepository.findByPhone(req.getPhone());
        if (opt.isEmpty()) {
            throw new RuntimeException("用户不存在");
        }
        User user = opt.get();
        String enc = encryptPassword(req.getPassword());
        if (!enc.equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        return user;
    }

    public User getById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public User update(Long userId, UpdateUserRequest req) {
        User u = getById(userId);
        if (req.getUsername() != null) u.setUsername(req.getUsername());
        if (req.getAvatarUrl() != null) u.setAvatarUrl(req.getAvatarUrl());
        return userRepository.save(u);
    }
}