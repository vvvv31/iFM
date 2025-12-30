package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.service.DailySentenceService;
import com.zjsu.yyd.ifmservice.model.dailySentence.DailySentence;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * API每日一句控制器 - 为前端提供/api/daily-sentence接口
 */
@RestController
@RequestMapping("/api")
@Tag(name = "API每日一句接口", description = "为前端应用提供每日一句功能")
public class ApiDailySentenceController {

    private final DailySentenceService dailySentenceService;

    @Autowired
    public ApiDailySentenceController(DailySentenceService dailySentenceService) {
        this.dailySentenceService = dailySentenceService;
    }

    @Operation(summary = "获取最新每日一句", description = "为前端应用提供最新的每日一句，支持游客访问")
    @GetMapping("/daily-sentence")
    public Result<DailySentence> getLatest() {
        try {
            List<DailySentence> sentences = dailySentenceService.list();
            if (sentences != null && !sentences.isEmpty()) {
                // 返回最新的每日一句
                DailySentence latestSentence = sentences.get(sentences.size() - 1);
                return Result.success(latestSentence);
            } else {
                // 如果没有每日一句，返回默认内容
                DailySentence defaultSentence = new DailySentence();
                defaultSentence.setId(0L);
                defaultSentence.setEnglish("Every day is a new beginning.");
                defaultSentence.setChinese("每天都是一个新的开始。");
                defaultSentence.setAuthor("Unknown");
                defaultSentence.setCreatedAt(LocalDateTime.now());
                return Result.success(defaultSentence);
            }
        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
    }
}