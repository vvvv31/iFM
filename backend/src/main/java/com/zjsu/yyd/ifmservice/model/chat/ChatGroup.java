package com.zjsu.yyd.ifmservice.model.chat;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chat_group")
@Schema(name = "ChatGroup", description = "群组信息实体")
public class ChatGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "群组ID", example = "1")
    private Long groupId;

    @Column(nullable = false)
    @Schema(description = "群组名称", example = "语法交流群")
    private String groupName;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "群组描述", example = "这是一个分享语法知识的群")
    private String description;

    @Column(nullable = false)
    @Schema(description = "群主ID", example = "1001")
    private Long ownerId;

    @Column(nullable = false, unique = true)
    @Schema(description = "群组邀请码", example = "ABC123")
    private String inviteCode;

    @CreationTimestamp
    @Schema(description = "群组创建时间")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Schema(description = "群组更新时间")
    private LocalDateTime updatedAt;
}
