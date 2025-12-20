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
    public void addSubscribe(Long userId, Long creatorId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        UserProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);     // ★ 关键：自动同步主键
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
