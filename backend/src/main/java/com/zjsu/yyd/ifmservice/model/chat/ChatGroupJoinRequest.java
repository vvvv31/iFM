package com.zjsu.yyd.ifmservice.model.chat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "加入群聊请求体")
public class ChatGroupJoinRequest {

    @Schema(description = "群聊邀请码", example = "ABC123", required = true)
    private String inviteCode;

    @Schema(description = "用户ID", example = "1002", required = true)
    private Long userId;
}