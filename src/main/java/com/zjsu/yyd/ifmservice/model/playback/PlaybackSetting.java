package com.zjsu.yyd.ifmservice.model.playback;

import lombok.Data;
import jakarta.persistence.*;  // 修改导入语句

@Entity
@Data
@Table(name = "playback_settings")
@IdClass(PlaybackSettingId.class) // 复合主键类
public class PlaybackSetting {
    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "speed", columnDefinition = "FLOAT DEFAULT 1.0")
    private Float speed = 1.0f;

    @Column(name = "loop_count", columnDefinition = "INT DEFAULT 1")
    private Integer loopCount = 1;

    @Column(name = "subtitles_enabled", columnDefinition = "TINYINT DEFAULT 1")
    private Boolean subtitlesEnabled = true;
}