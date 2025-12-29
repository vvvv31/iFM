package com.zjsu.yyd.ifmservice.model.dailySentence;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 每日一句音频实体（学生朗读记录）
 */
@Data
@Entity
@Table(name = "daily_sentence_audio")
public class DailySentenceAudio {

    /** 主键 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 每日一句 ID */
    @Column(nullable = false)
    private Long dailySentenceId;

    /** 用户 ID */
    @Column(nullable = false)
    private Long userId;

    /** 音频存储地址 */
    @Column(nullable = false)
    private String audioUrl;

    /** 准确度分 */
    private Double accuracyScore;

    /** 标准度分 */
    private Double standardScore;

    /** 流利度分 */
    private Double fluencyScore;

    /** 成人句子总分：total_score = 0.6*accuracy + 0.3*fluency + 0.1*standard */
    private Double totalScore;

    /** 教师指导建议 */
    @Column(columnDefinition = "TEXT")
    private String advice;

    /** 创建时间 */
    @CreationTimestamp
    private LocalDateTime createdAt;

    /** 更新时间 */
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /** 更新总分 */
    public void calculateTotalScore() {
        double acc = this.accuracyScore != null ? this.accuracyScore : 0.0;
        double flu = this.fluencyScore != null ? this.fluencyScore : 0.0;
        double std = this.standardScore != null ? this.standardScore : 0.0;
        this.totalScore = acc * 0.6 + flu * 0.3 + std * 0.1;
    }
}
