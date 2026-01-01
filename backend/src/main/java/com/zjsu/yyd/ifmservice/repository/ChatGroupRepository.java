package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.chat.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
    Optional<ChatGroup> findByInviteCode(String inviteCode);
}
