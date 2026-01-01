package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.chat.ChatMessage;
import com.zjsu.yyd.ifmservice.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {

    private final ChatMessageRepository repo;

    public ChatMessageService(ChatMessageRepository repo) {
        this.repo = repo;
    }

    public ChatMessage send(Long groupId, Long senderId, String content, String note) {
        ChatMessage m = new ChatMessage();
        m.setGroupId(groupId);
        m.setSenderId(senderId);
        m.setContent(content);
        m.setGrammarNote(note);
        return repo.save(m);
    }

    public List<ChatMessage> list(Long groupId) {
        return repo.findByGroupIdOrderByCreatedAtAsc(groupId);
    }
}
