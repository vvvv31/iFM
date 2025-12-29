package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.program.ProgramDTO;
import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.program.Program;
import com.zjsu.yyd.ifmservice.service.ProgramService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programs")
//@SwaggerTag(name = "节目接口", description = "提供节目 CRUD 接口")
public class ProgramController {

    @Autowired
    private ProgramService programService;

    @Operation(summary = "创建节目")
    @PostMapping
    public Result<Program> create(@RequestBody ProgramDTO dto) {
        return Result.success(programService.create(dto));
    }

    @Operation(summary = "获取所有节目")
    @GetMapping
    public Result<List<Program>> list() {
        return Result.success(programService.list());
    }

    @Operation(summary = "根据 ID 获取节目")
    @GetMapping("/{id}")
    public Result<Program> detail(@PathVariable Long id) {
        return Result.success(programService.get(id));
    }

    @Operation(summary = "更新节目")
    @PutMapping("/{id}")
    public Result<Program> update(@PathVariable Long id, @RequestBody ProgramDTO dto) {
        return Result.success(programService.update(id, dto));
    }

    @Operation(summary = "删除节目")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        programService.delete(id);
        return Result.success(null);
    }
}
