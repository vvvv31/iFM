package com.zjsu.yyd.ifmservice.model.chat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "创建群聊请求体")
public class ChatGroupCreateRequest {

    @Schema(description = "群聊名称", example = "语法交流群", required = true)
    private String groupName;

    @Schema(description = "群聊描述", example = "这是一个分享语法知识的群")
    private String description;

    @Schema(description = "群主用户ID", example = "1001", required = true)
    private Long ownerId;

    @Schema(description = "群邀请码（可选）", example = "ABCD1234")
    private String inviteCode;
}
