package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.service.DailySentenceService;
import com.zjsu.yyd.ifmservice.model.dailySentence.DailySentence;
import com.zjsu.yyd.ifmservice.model.dailySentence.DailySentenceDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 每日一句控制器 - 处理每日一句相关功能
 */
@RestController
@RequestMapping("/daily-sentences")
@Tag(name = "每日一句接口", description = "管理每日一句内容")
public class DailySentenceController {

    private final DailySentenceService dailySentenceService;

    @Autowired
    public DailySentenceController(DailySentenceService dailySentenceService) {
        this.dailySentenceService = dailySentenceService;
    }

    @Operation(summary = "创建每日一句", description = "添加新的每日一句内容")
    @PostMapping
    public Result<DailySentence> create(@RequestBody DailySentenceDTO dailySentenceDTO) {
        try {
            DailySentence savedSentence = dailySentenceService.create(dailySentenceDTO);
            return Result.success(savedSentence);
        } catch (Exception e) {
            return Result.error("创建每日一句失败: " + e.getMessage());
        }
    }

    @Operation(summary = "查询所有每日一句", description = "获取所有每日一句列表")
    @GetMapping
    public Result<List<DailySentence>> list() {
        try {
            List<DailySentence> sentences = dailySentenceService.list();
            return Result.success(sentences);
        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @Operation(summary = "根据ID查询每日一句", description = "根据指定ID获取每日一句详情")
    @GetMapping("/{id}")
    public Result<DailySentence> getById(@PathVariable Long id) {
        try {
            DailySentence sentence = dailySentenceService.get(id);
            if (sentence != null) {
                return Result.success(sentence);
            } else {
                return Result.error("未找到指定的每日一句");
            }
        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @Operation(summary = "更新每日一句", description = "更新指定的每日一句内容")
    @PutMapping("/{id}")
    public Result<DailySentence> update(@PathVariable Long id, @RequestBody DailySentenceDTO dailySentenceDTO) {
        try {
            DailySentence updatedSentence = dailySentenceService.update(id, dailySentenceDTO);
            return Result.success(updatedSentence);
        } catch (Exception e) {
            return Result.error("更新失败: " + e.getMessage());
        }
    }

    @Operation(summary = "删除每日一句", description = "删除指定的每日一句")
    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            dailySentenceService.delete(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除失败: " + e.getMessage());
        }
    }
}