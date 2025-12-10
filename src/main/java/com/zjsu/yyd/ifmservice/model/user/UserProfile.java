package com.zjsu.yyd.ifmservice.model.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "user_profile")
public class UserProfile {

    // 主键就是 userId，同时也是外键
    @Id
    private Long userId;

    // 与 User 共享主键
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonBackReference  // 防止无限循环
    private User user;

    private Long totalListenTime = 0L;
    private Integer fansCount = 0;
    private Integer followCount = 0;

    @ElementCollection
    private List<Long> subscribeCreatorIds;

    @ElementCollection
    private List<Long> collectAudioIds;

    // Getter and Setter methods
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getTotalListenTime() {
        return totalListenTime;
    }

    public void setTotalListenTime(Long totalListenTime) {
        this.totalListenTime = totalListenTime;
    }

    public Integer getFansCount() {
        return fansCount;
    }

    public void setFansCount(Integer fansCount) {
        this.fansCount = fansCount;
    }

    public Integer getFollowCount() {
        return followCount;
    }

    public void setFollowCount(Integer followCount) {
        this.followCount = followCount;
    }

    public List<Long> getSubscribeCreatorIds() {
        return subscribeCreatorIds;
    }

    public void setSubscribeCreatorIds(List<Long> subscribeCreatorIds) {
        this.subscribeCreatorIds = subscribeCreatorIds;
    }

    public List<Long> getCollectAudioIds() {
        return collectAudioIds;
    }

    public void setCollectAudioIds(List<Long> collectAudioIds) {
        this.collectAudioIds = collectAudioIds;
    }
}
