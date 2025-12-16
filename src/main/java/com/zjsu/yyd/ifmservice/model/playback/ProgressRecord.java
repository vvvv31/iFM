package com.zjsu.yyd.ifmservice.model.playback;

import lombok.Data;

@Data
public class ProgressRecord {
    private Long userId;
    private Long contentId;
    private Integer progressSeconds; // 播放进度（秒）
    private Integer totalSeconds;    // 总时长（秒）
    private String status;          // 播放状态：playing, paused, completed
}