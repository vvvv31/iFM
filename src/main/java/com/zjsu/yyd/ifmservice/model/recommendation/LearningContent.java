package com.zjsu.yyd.ifmservice.model.recommendation;

import lombok.Data;
import jakarta.persistence.*;  // 修改导入语句
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "learning_contents")
public class LearningContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Long contentId;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "source")
    private String source;

    @Column(name = "level")
    private String level;

    @Column(name = "type")
    private String type;

    @Column(name = "category_id")
    private Integer categoryId;
}