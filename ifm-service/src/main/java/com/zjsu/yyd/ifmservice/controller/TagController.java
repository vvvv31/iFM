package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;

import com.zjsu.yyd.ifmservice.model.Tag;
import com.zjsu.yyd.ifmservice.service.TagService;
import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
@io.swagger.v3.oas.annotations.tags.Tag(name = "标签接口", description = "提供标签增删改查接口")


public class TagController {

    @Autowired
    private TagService tagService;

    @Operation(summary = "创建标签")
    @PostMapping
    public Result<Tag> create(@RequestBody Tag tag) {
        return Result.success(tagService.create(tag));
    }

    @Operation(summary = "获取所有标签")
    @GetMapping
    public Result<List<Tag>> list() {
        return Result.success(tagService.list());
    }

    @Operation(summary = "更新标签")
    @PutMapping("/{id}")
    public Result<Tag> update(@PathVariable Long id, @RequestBody Tag tag) {
        return Result.success(tagService.update(id, tag));
    }

    @Operation(summary = "删除标签")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        tagService.delete(id);
        return Result.success(null);
    }
}
