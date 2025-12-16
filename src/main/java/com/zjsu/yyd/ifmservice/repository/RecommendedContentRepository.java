package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.recommendation.RecommendedContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendedContentRepository extends JpaRepository<RecommendedContent, Long> {
    // 个性化推荐
    Page<RecommendedContent> findByUserIdOrderByScoreDesc(Long userId, Pageable pageable);
}