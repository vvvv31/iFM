// Audio.java
package com.zjsu.yyd.ifmservice.model.audio;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.zjsu.yyd.ifmservice.model.program.Program;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "audios")
public class Audio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long audioId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private String url;

    private String coverUrl;

    private Long duration; // 单位：秒

    @Column(nullable = false)
    private Long creatorId;

    private String category;

    private Integer playCount = 0;
    private Integer likeCount = 0;
    private Integer commentCount = 0;

    // 版本2新增字段
    private String filePath;
    private String lyricPath;

    @ManyToOne
    @JoinColumn(name = "program_id")
    @JsonBackReference // 解决无限递归
    private Program program;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Getter 和 Setter 略，与原来一致
    // ...
}
