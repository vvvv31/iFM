package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.audio.Audio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 音频仓库
 * 提供音频 CRUD 操作
 */
@Repository
public interface AudioRepository extends JpaRepository<Audio, Long> {

    /**
     * 根据课程 ID 查询课程下的所有音频
     * @param programId 节目 ID
     * @return 音频列表
     */
    List<Audio> findByProgramProgramId(Long programId);
}
