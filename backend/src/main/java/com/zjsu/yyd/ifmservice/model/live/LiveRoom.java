package com.zjsu.yyd.ifmservice.model.live;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "live_room")
public class LiveRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long liveId;

    private String title;

    @Column(nullable = false)
    private Long hostUserId; // 对应 users.user_id

    private String description;

    /**
     * 0 未开始
     * 1 直播中
     * 2 已结束
     */
    private Integer status = 0;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @CreationTimestamp
    private LocalDateTime createTime;

//    // getter / setter
//    public Long getLiveId() { return liveId; }
//    public void setLiveId(Long liveId) { this.liveId = liveId; }
//
//    public String getTitle() { return title; }
//    public void setTitle(String title) { this.title = title; }
//
//    public Long getHostUserId() { return hostUserId; }
//    public void setHostUserId(Long hostUserId) { this.hostUserId = hostUserId; }
//
//    public String getDescription() { return description; }
//    public void setDescription(String description) { this.description = description; }
//
//    public Integer getStatus() { return status; }
//    public void setStatus(Integer status) { this.status = status; }
//
//    public LocalDateTime getStartTime() { return startTime; }
//    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
//
//    public LocalDateTime getEndTime() { return endTime; }
//    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
//
//    public LocalDateTime getCreateTime() { return createTime; }
}
