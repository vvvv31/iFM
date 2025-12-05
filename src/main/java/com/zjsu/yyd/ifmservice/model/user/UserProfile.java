package com.zjsu.yyd.ifmservice.model.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "user_profile")
@Data
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
}
