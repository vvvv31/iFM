package com.zjsu.yyd.ifmservice.model;

import com.zjsu.yyd.ifmservice.model.Tag;
import com.zjsu.yyd.ifmservice.model.audio.Audio;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 节目 / 课程实体
 */
@Data
@Entity
@Table(name = "programs")
public class Program {

    /** 课程 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long programId;

    /** 课程标题 */
    @Column(nullable = false)
    private String title;

    /** 课程介绍 */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String introduction;

    /** 常见问题 */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String faq;

    /** 课程总评分 */
    private Double rating;

    /** 课程封面 */
    private String coverUrl;

    /** 播放量 */
    private Long playCount = 0L;

    /** 创建者 ID */
    @Column(nullable = false)
    private Long creatorId;

    /** 课程标签，多对多关联 */
    @ManyToMany
    @JoinTable(
            name = "program_tags",
            joinColumns = @JoinColumn(name = "program_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    /** 课程下的音频列表 */
    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Audio> audios;

    /** 创建时间 */
    @CreationTimestamp
    private LocalDateTime createdAt;

    /** 更新时间 */
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
