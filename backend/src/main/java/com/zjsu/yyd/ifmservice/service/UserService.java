package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.user.*;
import com.zjsu.yyd.ifmservice.repository.UserProfileRepository;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserProfileService userProfileService;

    // 构造函数
    @Autowired
    public UserService(UserRepository userRepository, UserProfileRepository userProfileRepository, UserProfileService userProfileService) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.userProfileService = userProfileService;
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

    /** 
     * 获取用户信息，如果用户不存在或为游客模式，返回null
     * 用于认证拦截器中处理游客模式
     */
    public User getByIdOrNull(Long userId) {
        if (userId == null) {
            return null;
        }
        return userRepository.findById(userId).orElse(null);
    }

    /**
     * 为指定用户创建默认的UserProfile（用于修复数据）
     */
    public UserProfile createDefaultProfileForUser(Long userId) {
        User user = getById(userId);
        return userProfileService.createDefaultProfile(user);
    }

    /** 更新用户基本信息 */
    // 根据手机号查找用户
    public User findByPhone(String phone) {
        Optional<User> userOptional = userRepository.findByPhone(phone);
        return userOptional.orElse(null);
    }

    // 保存用户
    public User save(User user) {
        // 对密码进行加密
        if (user.getPassword() != null && !user.getPassword().startsWith(SALT)) {
            user.setPassword(encryptPassword(user.getPassword()));
        }
        return userRepository.save(user);
    }

    // 更新密码
    public boolean updatePassword(String phone, String newPassword) {
        Optional<User> userOptional = userRepository.findByPhone(phone);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(encryptPassword(newPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }

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

    /**
     * 检查用户是否存在
     */
    public boolean existsById(Long userId) {
        return userId != null && userRepository.existsById(userId);
    }

    /**
     * 获取用户的统计数据（用于状态接口）
     */
    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        if (userId == null) {
            // 游客模式或无用户ID
            stats.put("followCount", 0);
            stats.put("fansCount", 0);
            stats.put("collectCount", 0);
            stats.put("listenTime", 0L);
            return stats;
        }
        
        try {
            User user = getById(userId);
            if (user.getProfile() != null) {
                UserProfile profile = user.getProfile();
                stats.put("followCount", profile.getFollowCount() != null ? profile.getFollowCount() : 0);
                stats.put("fansCount", profile.getFansCount() != null ? profile.getFansCount() : 0);
                stats.put("collectCount", profile.getCollectAudioIds() != null ? profile.getCollectAudioIds().size() : 0);
                stats.put("listenTime", profile.getTotalListenTime() != null ? profile.getTotalListenTime() : 0L);
            } else {
                // 新用户，没有profile，初始化为0
                stats.put("followCount", 0);
                stats.put("fansCount", 0);
                stats.put("collectCount", 0);
                stats.put("listenTime", 0L);
            }
        } catch (Exception e) {
            // 用户不存在，退化为游客数据
            stats.put("followCount", 0);
            stats.put("fansCount", 0);
            stats.put("collectCount", 0);
            stats.put("listenTime", 0L);
        }
        
        return stats;
    }
}