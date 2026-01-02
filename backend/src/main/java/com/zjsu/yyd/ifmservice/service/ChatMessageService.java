package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.chat.ChatMessage;
import com.zjsu.yyd.ifmservice.repository.ChatMessageRepository;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {

    private final ChatMessageRepository repo;
    private final UserRepository userRepository;

    public ChatMessageService(ChatMessageRepository repo, UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    public ChatMessage send(Long groupId, Long senderId, String content, String note) {
        ChatMessage m = new ChatMessage();
        m.setGroupId(groupId);
        m.setSenderId(senderId);
        m.setContent(content);
        m.setGrammarNote(note);
        return repo.save(m);
    }

    public List<Map<String, Object>> list(Long groupId) {
        List<ChatMessage> messages = repo.findByGroupIdOrderByCreatedAtAsc(groupId);

        return messages.stream().map(msg -> {
            Map<String, Object> map = new HashMap<>();
            map.put("messageId", msg.getMessageId());
            map.put("groupId", msg.getGroupId());
            map.put("senderId", msg.getSenderId());
            map.put("content", msg.getContent());
            map.put("grammarNote", msg.getGrammarNote());
            map.put("createdAt", msg.getCreatedAt());

            // 查询发送者用户名
            userRepository.findById(msg.getSenderId()).ifPresent(user -> {
                map.put("senderName", user.getUsername());
            });

            return map;
        }).collect(Collectors.toList());
    }
}