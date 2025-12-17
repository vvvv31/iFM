package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.user.User;
import com.zjsu.yyd.ifmservice.model.user.UserProfile;
import com.zjsu.yyd.ifmservice.repository.UserProfileRepository;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import jakarta.transaction.Transactional;
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
        if (profile.getUser() == null) {
            throw new RuntimeException("UserProfile 缺少 user，无法保存（@MapsId）");
        }
        return profileRepository.save(profile);
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
     * 添加订阅
     */
    @Transactional
    public void addSubscribe(Long userId, Long creatorId) {

        if (userId.equals(creatorId)) {
            throw new RuntimeException("不能关注自己");
        }

        // 1️⃣ 查 A（关注者）
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        UserProfile userProfile = profileRepository.findById(userId)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);
                    return p;
                });

        // 初始化关注列表
        if (userProfile.getSubscribeCreatorIds() == null) {
            userProfile.setSubscribeCreatorIds(new ArrayList<>());
        }

        // 已关注，直接返回（防止重复）
        if (userProfile.getSubscribeCreatorIds().contains(creatorId)) {
            return;
        }

        // 2️⃣ 查 B（被关注者）
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("被关注用户不存在"));

        UserProfile creatorProfile = profileRepository.findById(creatorId)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(creator);
                    return p;
                });

        // 3️⃣ 执行业务更新
        userProfile.getSubscribeCreatorIds().add(creatorId);
        userProfile.setFollowCount(userProfile.getSubscribeCreatorIds().size());

        creatorProfile.setFansCount(
                (creatorProfile.getFansCount() == null ? 0 : creatorProfile.getFansCount()) + 1
        );

        // 4️⃣ 保存
        profileRepository.save(userProfile);
        profileRepository.save(creatorProfile);
    }


    /**
     * 移除订阅
     */
    @Transactional
    public void removeSubscribe(Long userId, Long creatorId) {

        UserProfile userProfile = profileRepository.findById(userId).orElse(null);
        UserProfile creatorProfile = profileRepository.findById(creatorId).orElse(null);

        if (userProfile == null || creatorProfile == null ||
                userProfile.getSubscribeCreatorIds() == null) {
            return;
        }

        // 未关注，直接返回
        if (!userProfile.getSubscribeCreatorIds().contains(creatorId)) {
            return;
        }

        // 1️⃣ A 取消关注 B
        userProfile.getSubscribeCreatorIds().remove(creatorId);
        userProfile.setFollowCount(userProfile.getSubscribeCreatorIds().size());

        // 2️⃣ B 粉丝数 -1（防止负数）
        int fans = creatorProfile.getFansCount() == null ? 0 : creatorProfile.getFansCount();
        creatorProfile.setFansCount(Math.max(0, fans - 1));

        profileRepository.save(userProfile);
        profileRepository.save(creatorProfile);
    }


    /**
     * 添加收藏
     */
    public void addCollect(Long userId, Long audioId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        UserProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);  // ★ 自动将主键设为 user.id
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

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        UserProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);   // ★ 必须设置 user
                    return p;
                });

        long old = profile.getTotalListenTime() == null ? 0 : profile.getTotalListenTime();
        profile.setTotalListenTime(old + seconds);

        profileRepository.save(profile);
    }
}
