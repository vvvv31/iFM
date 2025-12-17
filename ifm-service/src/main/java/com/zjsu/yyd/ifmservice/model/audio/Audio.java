package com.zjsu.yyd.ifmservice.model.audio;

import com.zjsu.yyd.ifmservice.model.Program;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 单节音频实体
 */
@Data
@Entity
@Table(name = "audios")
public class Audio {

    /** 音频 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long audioId;

    /** 音频标题 */
    @Column(nullable = false)
    private String title;

    /** 音频描述 */
    private String description;

    /** 本地存储音频路径 */
    @Column(nullable = false)
    private String filePath;

    /** 音频时长，单位秒 */
    private Long duration;

    /** 播放量 */
    private Long playCount = 0L;

    /** 本地存储歌词文本路径 */
    private String lyricPath;

    /** 所属课程 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    /** 创建时间 */
    @CreationTimestamp
    private LocalDateTime createdAt;
}
