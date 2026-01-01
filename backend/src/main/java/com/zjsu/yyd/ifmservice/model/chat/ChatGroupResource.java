package com.zjsu.yyd.ifmservice.model.chat;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chat_group_resource",
        uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "program_id"}))
@Schema(name = "ChatGroupResource", description = "群组关联节目/资源信息实体")
public class ChatGroupResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID", example = "1")
    private Long id;

    @Column(name = "group_id", nullable = false)
    @Schema(description = "群组ID", example = "1")
    private Long groupId;

    @Column(name = "program_id", nullable = false)
    @Schema(description = "节目/资源ID", example = "2001")
    private Long programId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @Schema(description = "关联创建时间")
    private LocalDateTime createdAt;
}
