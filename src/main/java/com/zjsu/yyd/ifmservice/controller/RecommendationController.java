package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService service;

    @GetMapping("")
    public Object getPersonalizedRecommendations(
            @RequestParam Long user_id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return service.getPersonalizedRecommendations(user_id, page, limit);
    }

    @GetMapping("/authoritative")
    public Object getAuthoritativeResources(
            @RequestParam String source,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return service.getAuthoritativeResources(source, page, limit);
    }

    @GetMapping("/search")
    public Object searchContents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return service.searchContents(keyword, level, type, page, limit);
    }

    @GetMapping("/category")
    public Object getContentsByCategory(
            @RequestParam int category_id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return service.getContentsByCategory(category_id, page, limit);
    }
}