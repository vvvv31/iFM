package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByGroupIdOrderByCreatedAtAsc(Long groupId);
}
