package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.chat.ChatMessage;
import com.zjsu.yyd.ifmservice.service.ChatMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/message")
@Tag(name = "群聊消息模块", description = "提供群聊消息的发送、查询等功能接口")
public class ChatMessageController {

    private final ChatMessageService service;

    public ChatMessageController(ChatMessageService service) {
        this.service = service;
    }

    @Operation(
            summary = "获取群聊消息列表",
            description = "根据群ID获取该群内的聊天消息记录，按时间顺序返回"
    )
    @GetMapping("/list")
    public Result<List<ChatMessage>> list(
            @RequestParam Long groupId
    ) {
        return Result.success(service.list(groupId));
    }

    @Operation(
            summary = "发送群聊消息",
            description = "向指定群聊发送一条消息，支持附带语法纠错/学习备注信息"
    )
    @PostMapping("/send")
    public Result<ChatMessage> send(
            @RequestBody Map<String, Object> req
    ) {
        ChatMessage m = service.send(
                Long.valueOf(req.get("groupId").toString()),
                Long.valueOf(req.get("senderId").toString()),
                (String) req.get("content"),
                (String) req.get("grammarNote")
        );
        return Result.success(m);
    }
}
