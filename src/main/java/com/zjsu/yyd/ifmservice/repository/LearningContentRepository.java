package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.recommendation.LearningContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningContentRepository extends JpaRepository<LearningContent, Long> {
    // 权威资源
    Page<LearningContent> findBySource(String source, Pageable pageable);

    // 分类浏览
    Page<LearningContent> findByCategoryId(Integer categoryId, Pageable pageable);

    // 搜索
    @Query("SELECT l FROM LearningContent l WHERE " +
            "(l.title LIKE %:keyword% OR l.description LIKE %:keyword%) AND " +
            "(:level IS NULL OR l.level = :level) AND " +
            "(:type IS NULL OR l.type = :type)")
    Page<LearningContent> search(
            @Param("keyword") String keyword,
            @Param("level") String level,
            @Param("type") String type,
            Pageable pageable
    );
}