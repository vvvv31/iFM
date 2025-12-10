package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.audio.Audio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AudioRepository extends JpaRepository<Audio, Long> {
    
    // 根据创作者ID查询音频列表
    List<Audio> findByCreatorId(Long creatorId);
    
    // 根据分类查询音频列表
    List<Audio> findByCategory(String category);
    
    // 根据标题模糊查询
    List<Audio> findByTitleContaining(String title);
    
    // 根据创作者ID和标题模糊查询
    List<Audio> findByCreatorIdAndTitleContaining(Long creatorId, String title);
}