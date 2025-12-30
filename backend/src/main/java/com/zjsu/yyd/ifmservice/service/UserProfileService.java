package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.user.User;
import com.zjsu.yyd.ifmservice.model.user.UserProfile;
import com.zjsu.yyd.ifmservice.repository.UserProfileRepository;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * 创建或更新用户资料
     * 一定要确保已经关联 user，否则 @MapsId 会报错
     */
    public UserProfile saveOrUpdate(UserProfile profile) {
        if (profile.getUser() == null && profile.getUserId() == null) {
            throw new RuntimeException("UserProfile 缺少 user 或 userId，无法保存");
        }
        
        // 如果有 userId 但没有 user 实体，尝试获取 user
        if (profile.getUser() == null && profile.getUserId() != null) {
            User user = userRepository.findById(profile.getUserId())
                    .orElseThrow(() -> new RuntimeException("用户不存在"));
            profile.setUser(user);
        }
        
        return profileRepository.save(profile);
    }

    /**
     * 获取用户资料，如果不存在则返回默认资料
     */
    public UserProfile getByUserIdOrDefault(Long userId) {
        if (userId == null) {
            return getDefaultProfile();
        }
        
        Optional<UserProfile> profileOpt = profileRepository.findById(userId);
        return profileOpt.orElseGet(() -> {
            // 如果用户资料不存在，返回默认资料
            return getDefaultProfile();
        });
    }

    public Optional<UserProfile> getByUserId(Long userId) {
        return profileRepository.findById(userId);
    }

    public void deleteByUserId(Long userId) {
        profileRepository.deleteById(userId);
    }

    public List<UserProfile> getAll() {
        return profileRepository.findAll();
    }

    /**
     * 为新用户创建默认的用户资料
     */
    public UserProfile createDefaultProfile(User user) {
        UserProfile defaultProfile = new UserProfile();
        defaultProfile.setUser(user);
        defaultProfile.setUserId(user.getUserId());
        defaultProfile.setTotalListenTime(0L);
        defaultProfile.setFansCount(0);
        defaultProfile.setFollowCount(0);
        defaultProfile.setSubscribeCreatorIds(new ArrayList<>());
        defaultProfile.setCollectAudioIds(new ArrayList<>());
        
        return profileRepository.save(defaultProfile);
    }

    /**
     * 获取默认的用户资料
     */
    public UserProfile getDefaultProfile() {
        UserProfile defaultProfile = new UserProfile();
        defaultProfile.setUserId(null); // 游客模式没有用户ID
        defaultProfile.setTotalListenTime(0L);
        defaultProfile.setFansCount(0);
        defaultProfile.setFollowCount(0);
        defaultProfile.setSubscribeCreatorIds(new ArrayList<>());
        defaultProfile.setCollectAudioIds(new ArrayList<>());
        return defaultProfile;
    }

    /**
     * 添加订阅
     */
    public void addSubscribe(Long userId, Long creatorId) {
        if (userId == null) {
            throw new RuntimeException("游客模式，无法执行关注操作");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        UserProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);     // ★ 关键：自动同步主键
                    p.setUserId(userId);
                    p.setTotalListenTime(0L);
                    p.setFansCount(0);
                    p.setFollowCount(0);
                    p.setSubscribeCreatorIds(new ArrayList<>());
                    p.setCollectAudioIds(new ArrayList<>());
                    return p;
                });

        if (profile.getSubscribeCreatorIds() == null)
            profile.setSubscribeCreatorIds(new ArrayList<>());

        if (!profile.getSubscribeCreatorIds().contains(creatorId)) {
            profile.getSubscribeCreatorIds().add(creatorId);
        }

        profile.setFollowCount(profile.getSubscribeCreatorIds().size());

        profileRepository.save(profile);
    }

    /**
     * 移除订阅
     */
    public void removeSubscribe(Long userId, Long creatorId) {
        if (userId == null) {
            throw new RuntimeException("游客模式，无法执行取消关注操作");
        }

        UserProfile profile = profileRepository.findById(userId).orElse(null);
        if (profile != null && profile.getSubscribeCreatorIds() != null) {

            profile.getSubscribeCreatorIds().remove(creatorId);

            profile.setFollowCount(profile.getSubscribeCreatorIds().size());

            profileRepository.save(profile);
        }
    }

    /**
     * 添加收藏
     */
    public void addCollect(Long userId, Long audioId) {
        if (userId == null) {
            throw new RuntimeException("游客模式，无法执行收藏操作");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        UserProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);  // ★ 自动将主键设为 user.id
                    p.setUserId(userId);
                    p.setTotalListenTime(0L);
                    p.setFansCount(0);
                    p.setFollowCount(0);
                    p.setSubscribeCreatorIds(new ArrayList<>());
                    p.setCollectAudioIds(new ArrayList<>());
                    return p;
                });

        if (profile.getCollectAudioIds() == null)
            profile.setCollectAudioIds(new ArrayList<>());

        if (!profile.getCollectAudioIds().contains(audioId)) {
            profile.getCollectAudioIds().add(audioId);
        }

        profileRepository.save(profile);
    }

    /**
     * 移除收藏
     */
    public void removeCollect(Long userId, Long audioId) {
        if (userId == null) {
            throw new RuntimeException("游客模式，无法执行取消收藏操作");
        }

        UserProfile profile = profileRepository.findById(userId).orElse(null);
        if (profile != null && profile.getCollectAudioIds() != null) {

            profile.getCollectAudioIds().remove(audioId);

            profileRepository.save(profile);
        }
    }

    /**
     * 增加收听时长
     */
    public void addListenTime(Long userId, Long seconds) {
        if (userId == null) {
            // 游客模式下不记录收听时长，或者可以选择记录到前端临时存储
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        UserProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);   // ★ 必须设置 user
                    p.setUserId(userId);
                    p.setTotalListenTime(0L);
                    p.setFansCount(0);
                    p.setFollowCount(0);
                    p.setSubscribeCreatorIds(new ArrayList<>());
                    p.setCollectAudioIds(new ArrayList<>());
                    return p;
                });

        long old = profile.getTotalListenTime() == null ? 0 : profile.getTotalListenTime();
        profile.setTotalListenTime(old + seconds);

        profileRepository.save(profile);
    }
}