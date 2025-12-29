package com.zjsu.yyd.ifmservice.model.dailySentence;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 每日一句实体
 */
@Data
@Entity
@Table(name = "daily_sentence")

@io.swagger.v3.oas.annotations.media.Schema(
        description = "每日一句实体，包含英文原句、中文翻译及相关元数据信息"
)
public class DailySentence {

    @Schema(description = "每日一句唯一标识 ID", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(
            description = "英文原句内容",
            example = "The best way to predict the future is to create it."
    )
    @Column(nullable = false, columnDefinition = "TEXT")
    private String english;

    @Schema(
            description = "英文原句对应的中文翻译",
            example = "预测未来的最好方式，就是去创造未来。"
    )
    @Column(nullable = false, columnDefinition = "TEXT")
    private String chinese;

    @Schema(
            description = "作者或引用来源，可为空",
            example = "Peter Drucker"
    )
    private String author;

    @Schema(
            description = "记录创建时间，由系统自动生成",
            example = "2025-01-01T10:00:00"
    )
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Schema(
            description = "记录最后更新时间，由系统自动维护",
            example = "2025-01-02T12:30:00"
    )
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
