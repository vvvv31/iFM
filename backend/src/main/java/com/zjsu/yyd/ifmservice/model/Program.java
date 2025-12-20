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

    // 手动添加setter方法以确保编译通过
    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public void setFaq(String faq) {
        this.faq = faq;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    // 添加缺失的方法
    public Long getProgramId() {
        return programId;
    }

    public String getTitle() {
        return title;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }
}