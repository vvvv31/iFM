package com.zjsu.yyd.ifmservice.model.chat;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chat_message")
@Schema(name = "ChatMessage", description = "群组消息实体")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "消息ID", example = "1")
    private Long messageId;

    @Column(nullable = false)
    @Schema(description = "群组ID", example = "1")
    private Long groupId;

    @Column(nullable = false)
    @Schema(description = "发送者ID", example = "1001")
    private Long senderId;

    @Column(columnDefinition = "TEXT", nullable = false)
    @Schema(description = "消息内容", example = "大家好，这里是语法交流群")
    private String content;

    @Schema(description = "语法备注", example = "可选字段")
    private String grammarNote;

    @CreationTimestamp
    @Schema(description = "消息发送时间")
    private LocalDateTime createdAt;
}
