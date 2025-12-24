package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.DailySentence;
import com.zjsu.yyd.ifmservice.model.DailySentenceDTO;
import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.service.DailySentenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/daily-sentences")
@Tag(
        name = "每日一句接口",
        description = "用于管理每日一句内容的 RESTful 接口，支持每日一句的创建、查询、修改和删除操作"
)
public class DailySentenceController {

    @Autowired
    private DailySentenceService dailySentenceService;

    @Operation(
            summary = "创建每日一句",
            description = "新增一条每日一句记录，包含英文原句、中文翻译及可选的作者/来源信息"
    )
    @PostMapping
    public Result<DailySentence> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "每日一句创建参数",
                    required = true
            )
            @RequestBody DailySentenceDTO dto
    ) {
        return Result.success(dailySentenceService.create(dto));
    }

    @Operation(
            summary = "获取所有每日一句",
            description = "查询系统中所有已创建的每日一句列表，按创建时间排序返回"
    )
    @GetMapping
    public Result<List<DailySentence>> list() {
        return Result.success(dailySentenceService.list());
    }

    @Operation(
            summary = "根据 ID 获取每日一句",
            description = "根据每日一句的唯一 ID 查询对应的详细信息"
    )
    @GetMapping("/{id}")
    public Result<DailySentence> detail(
            @io.swagger.v3.oas.annotations.Parameter(
                    description = "每日一句的唯一标识 ID",
                    required = true,
                    example = "1"
            )
            @PathVariable Long id
    ) {
        return Result.success(dailySentenceService.get(id));
    }

    @Operation(
            summary = "更新每日一句",
            description = "根据 ID 更新指定的每日一句内容，可修改英文原句、中文翻译或作者信息"
    )
    @PutMapping("/{id}")
    public Result<DailySentence> update(
            @io.swagger.v3.oas.annotations.Parameter(
                    description = "每日一句的唯一标识 ID",
                    required = true,
                    example = "1"
            )
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "每日一句更新参数",
                    required = true
            )
            @RequestBody DailySentenceDTO dto
    ) {
        return Result.success(dailySentenceService.update(id, dto));
    }

    @Operation(
            summary = "删除每日一句",
            description = "根据 ID 删除指定的每日一句记录，删除后不可恢复"
    )
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @io.swagger.v3.oas.annotations.Parameter(
                    description = "每日一句的唯一标识 ID",
                    required = true,
                    example = "1"
            )
            @PathVariable Long id
    ) {
        dailySentenceService.delete(id);
        return Result.success(null);
    }
}

