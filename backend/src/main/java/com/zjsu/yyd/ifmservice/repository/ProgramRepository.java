package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.program.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 节目仓库
 * 提供节目（课程）增删改查操作
 */
@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    // 可根据 creatorId 查询用户创建的节目
    java.util.List<Program> findByCreatorId(Long creatorId);
}
