package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.user.*;
import com.zjsu.yyd.ifmservice.repository.UserProfileRepository;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.Optional;
import java.util.ArrayList;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    // 构造函数
    public UserService(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    private static final String SALT = "com.ifm";

    /** MD5 加密 */
    private String encryptPassword(String raw) {
        if (raw == null) raw = "";
        return DigestUtils.md5DigestAsHex((SALT + raw).getBytes());
    }

    /** 注册用户 + 自动创建 Profile（共享主键） */
    public User register(RegisterRequest req) {

        if (userRepository.existsByPhone(req.getPhone())) {
            throw new RuntimeException("手机号已注册");
        }

        /** 1. 创建 User */
        User user = new User();
        user.setPhone(req.getPhone());
        user.setUsername(req.getUsername());
        user.setPassword(encryptPassword(req.getPassword()));
        user.setLevel("A1");

        // 保存并生成 userId
        User savedUser = userRepository.save(user);

        /** 2. 创建 UserProfile，主键与 User 共享 */
        UserProfile profile = new UserProfile();

        // @MapsId 关键：必须先设置 user
        profile.setUser(savedUser);

        // 不要调用 setUserId() —— @MapsId 会自动同步主键
        // profile.setUserId(savedUser.getUserId());

        profile.setTotalListenTime(0L);
        profile.setFansCount(0);
        profile.setFollowCount(0);

        // 初始化 List（否则 ElementCollection 会 NPE）
        profile.setSubscribeCreatorIds(new ArrayList<>());
        profile.setCollectAudioIds(new ArrayList<>());

        // 保存 Profile
        userProfileRepository.save(profile);

        /** 3. 可选：双向绑定（让 user.getProfile 能返回 profile ） */
        savedUser.setProfile(profile);

        return savedUser;
    }

    /** 登录 */
    public User login(LoginRequest req) {
        Optional<User> opt = userRepository.findByPhone(req.getPhone());
        if (opt.isEmpty()) {
            throw new RuntimeException("用户不存在");
        }

        User user = opt.get();
        if (!encryptPassword(req.getPassword()).equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        return user;
    }

    /** 查询用户 */
    public User getById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    /** 更新用户基本信息 */
    public User update(Long userId, UpdateUserRequest req) {
        User u = getById(userId);

        if (req.getUsername() != null) {
            u.setUsername(req.getUsername());
        }

        if (req.getAvatarUrl() != null) {
            u.setAvatarUrl(req.getAvatarUrl());
        }

        return userRepository.save(u);
    }
}
