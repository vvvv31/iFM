package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.recommendation.LearningContent;
import com.zjsu.yyd.ifmservice.model.recommendation.RecommendedContent;
import com.zjsu.yyd.ifmservice.repository.LearningContentRepository;
import com.zjsu.yyd.ifmservice.repository.RecommendedContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendedContentRepository recommendedRepo;
    private final LearningContentRepository learningContentRepo;

    // 1. 个性化推荐
    public Page<LearningContent> getPersonalizedRecommendations(Long userId, int page, int limit) {
        return recommendedRepo.findByUserIdOrderByScoreDesc(userId, PageRequest.of(page - 1, limit))
                .map(RecommendedContent::getLearningContent);
    }

    // 2. 权威资源
    public Page<LearningContent> getAuthoritativeResources(String source, int page, int limit) {
        return learningContentRepo.findBySource(source, PageRequest.of(page - 1, limit));
    }

    // 3. 搜索
    public Page<LearningContent> searchContents(String keyword, String level, String type, int page, int limit) {
        return learningContentRepo.search(
                keyword != null ? keyword : "",
                level,
                type,
                PageRequest.of(page - 1, limit)
        );
    }

    // 4. 分类浏览
    public Page<LearningContent> getContentsByCategory(Integer categoryId, int page, int limit) {
        return learningContentRepo.findByCategoryId(categoryId, PageRequest.of(page - 1, limit));
    }
}