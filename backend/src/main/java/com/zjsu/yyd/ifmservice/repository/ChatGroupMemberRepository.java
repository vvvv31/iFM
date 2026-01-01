package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.chat.ChatGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatGroupMemberRepository extends JpaRepository<ChatGroupMember, Long> {
    List<ChatGroupMember> findByUserId(Long userId);
    List<ChatGroupMember> findByGroupId(Long groupId);
    boolean existsByGroupIdAndUserId(Long groupId, Long userId);
}
