package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.chat.ChatGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatGroupMemberRepository extends JpaRepository<ChatGroupMember, Long> {

    List<ChatGroupMember> findByUserId(Long userId);

    List<ChatGroupMember> findByGroupId(Long groupId);

    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

    @Query("SELECT m.groupId FROM ChatGroupMember m WHERE m.userId = :userId")
    List<Long> findGroupIdsByUserId(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ChatGroupMember m WHERE m.groupId = :groupId")
    void deleteByGroupId(@Param("groupId") Long groupId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ChatGroupMember m WHERE m.groupId = :groupId AND m.userId = :userId")
    void deleteByGroupIdAndUserId(@Param("groupId") Long groupId, @Param("userId") Long userId);

    // 新增：统计群组成员数
    @Query("SELECT COUNT(m) FROM ChatGroupMember m WHERE m.groupId = :groupId")
    long countByGroupId(@Param("groupId") Long groupId);
}