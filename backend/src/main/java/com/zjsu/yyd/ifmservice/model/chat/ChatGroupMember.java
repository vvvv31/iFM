package com.zjsu.yyd.ifmservice.model.chat;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chat_group_member",
        uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"}))
@Schema(name = "ChatGroupMember", description = "群组成员信息实体")
public class ChatGroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "成员ID", example = "1")
    private Long id;

    @Column(name = "group_id", nullable = false)
    @Schema(description = "群组ID", example = "1")
    private Long groupId;

    @Column(name = "user_id", nullable = false)
    @Schema(description = "用户ID", example = "1001")
    private Long userId;

    @Schema(description = "成员角色 0=成员 1=管理员 2=群主", example = "0")
    private Integer role = 0;

    @CreationTimestamp
    @Schema(description = "加入时间")
    private LocalDateTime joinTime;
}
