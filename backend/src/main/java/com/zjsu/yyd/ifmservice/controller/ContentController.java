package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.program.Program;
import com.zjsu.yyd.ifmservice.model.content.Banner;
import com.zjsu.yyd.ifmservice.model.content.Category;
import com.zjsu.yyd.ifmservice.model.content.Episode;
import com.zjsu.yyd.ifmservice.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@Tag(name = "内容模块", description = "提供首页轮播图、分类列表、节目推荐、节目详情等接口")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @Operation(
            summary = "获取首页轮播图",
            description = "获取首页轮播图列表",
            responses = {
                    @ApiResponse(responseCode = "200", description = "获取成功",
                            content = @Content(schema = @Schema(implementation = Banner.class))),
                    @ApiResponse(responseCode = "400", description = "获取失败")
            }
    )
    @GetMapping("/banner/list")
    public Result<List<Banner>> getBannerList() {
        try {
            List<Banner> bannerList = contentService.getBannerList();
            return Result.success(bannerList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取分类列表",
            description = "获取节目分类列表",
            responses = {
                    @ApiResponse(responseCode = "200", description = "获取成功",
                            content = @Content(schema = @Schema(implementation = Category.class))),
                    @ApiResponse(responseCode = "400", description = "获取失败")
            }
    )
    @GetMapping("/category/list")
    public Result<List<Category>> getCategoryList() {
        try {
            List<Category> categoryList = contentService.getCategoryList();
            return Result.success(categoryList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取推荐节目",
            description = "获取推荐节目列表",
            responses = {
                    @ApiResponse(responseCode = "200", description = "获取成功",
                            content = @Content(schema = @Schema(implementation = Program.class))),
                    @ApiResponse(responseCode = "400", description = "获取失败")
            }
    )
    @GetMapping("/recommend/list")
    public Result<List<Program>> getRecommendList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<Program> recommendList = contentService.getRecommendList(page, limit);
            return Result.success(recommendList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取分类下的节目列表",
            description = "根据分类ID获取节目列表",
            responses = {
                    @ApiResponse(responseCode = "200", description = "获取成功",
                            content = @Content(schema = @Schema(implementation = Program.class))),
                    @ApiResponse(responseCode = "400", description = "获取失败")
            }
    )
    @GetMapping("/program/list")
    public Result<List<Program>> getProgramList(
            @RequestParam Long categoryId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<Program> programList = contentService.getProgramListByCategoryId(categoryId, page, limit);
            return Result.success(programList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取节目详情",
            description = "根据节目ID获取节目详情",
            responses = {
                    @ApiResponse(responseCode = "200", description = "获取成功",
                            content = @Content(schema = @Schema(implementation = Program.class))),
                    @ApiResponse(responseCode = "404", description = "节目不存在")
            }
    )
    @GetMapping("/program/detail")
    public Result<Program> getProgramDetail(@RequestParam Long programId) {
        try {
            Program program = contentService.getProgramDetail(programId);
            return Result.success(program);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取节目集数",
            description = "根据节目ID获取节目集数列表",
            responses = {
                    @ApiResponse(responseCode = "200", description = "获取成功",
                            content = @Content(schema = @Schema(implementation = Episode.class))),
                    @ApiResponse(responseCode = "404", description = "节目不存在")
            }
    )
    @GetMapping("/episode/list")
    public Result<List<Episode>> getEpisodeList(
            @RequestParam Long programId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer limit) {
        try {
            List<Episode> episodeList = contentService.getEpisodeListByProgramId(programId, page, limit);
            return Result.success(episodeList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "获取集数详情",
            description = "根据集数ID获取集数详情",
            responses = {
                    @ApiResponse(responseCode = "200", description = "获取成功",
                            content = @Content(schema = @Schema(implementation = Episode.class))),
                    @ApiResponse(responseCode = "404", description = "集数不存在")
            }
    )
    @GetMapping("/episode/detail")
    public Result<Episode> getEpisodeDetail(@RequestParam Long episodeId) {
        try {
            Episode episode = contentService.getEpisodeDetail(episodeId);
            return Result.success(episode);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(
            summary = "搜索节目",
            description = "根据关键词搜索节目",
            responses = {
                    @ApiResponse(responseCode = "200", description = "搜索成功",
                            content = @Content(schema = @Schema(implementation = Program.class))),
                    @ApiResponse(responseCode = "400", description = "搜索失败")
            }
    )
    @GetMapping("/search")
    public Result<List<Program>> searchProgram(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<Program> programList = contentService.searchProgram(keyword, page, limit);
            return Result.success(programList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}