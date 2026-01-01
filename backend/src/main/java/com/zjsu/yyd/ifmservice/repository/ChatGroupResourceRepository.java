package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.chat.ChatGroupResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatGroupResourceRepository extends JpaRepository<ChatGroupResource, Long> {
    boolean existsByGroupIdAndProgramId(Long groupId, Long programId);
    Optional<ChatGroupResource> findByGroupIdAndProgramId(Long groupId, Long programId);
    List<ChatGroupResource> findByGroupId(Long groupId);
}
