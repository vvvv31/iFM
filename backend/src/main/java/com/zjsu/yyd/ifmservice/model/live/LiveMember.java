package com.zjsu.yyd.ifmservice.model.live;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "live_member")
public class LiveMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long liveId;

    private Long userId;

    /**
     * 0 听众
     * 1 主播
     */
    private Integer role = 0;

    @CreationTimestamp
    private LocalDateTime joinTime;

    private LocalDateTime leaveTime;

//    // getter / setter
//    public Long getId() { return id; }
//
//    public Long getLiveId() { return liveId; }
//    public void setLiveId(Long liveId) { this.liveId = liveId; }
//
//    public Long getUserId() { return userId; }
//    public void setUserId(Long userId) { this.userId = userId; }
//
//    public Integer getRole() { return role; }
//    public void setRole(Integer role) { this.role = role; }
//
//    public LocalDateTime getJoinTime() { return joinTime; }
//
//    public LocalDateTime getLeaveTime() { return leaveTime; }
//    public void setLeaveTime(LocalDateTime leaveTime) { this.leaveTime = leaveTime; }
}
