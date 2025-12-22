package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.audio.Audio;
import com.zjsu.yyd.ifmservice.model.audio.CreateAudioRequest;
import com.zjsu.yyd.ifmservice.model.audio.UpdateAudioRequest;
import com.zjsu.yyd.ifmservice.service.AudioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audio")
@Tag(name = "音频管理（版本1）", description = "音频内容基础管理接口（CRUD / 查询 / 点赞 / 播放）")
public class AudioControllerV1 {

    private final AudioService audioService;

    public AudioControllerV1(AudioService audioService) {
        this.audioService = audioService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "创建音频", description = "创建新的音频内容")
    public Result<Audio> createAudio(@RequestBody CreateAudioRequest request) {
        try {
            Audio audio = audioService.createAudio(request);
            return Result.success("音频创建成功", audio);
        } catch (Exception e) {
            return Result.error("音频创建失败: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取音频详情", description = "根据音频 ID 获取详细信息")
    public Result<Audio> getAudioById(@PathVariable("id") Long audioId) {
        try {
            Audio audio = audioService.getAudioById(audioId);
            return Result.success("音频查询成功", audio);
        } catch (Exception e) {
            return Result.error("音频查询失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新音频", description = "更新音频基本信息")
    public Result<Audio> updateAudio(
            @PathVariable("id") Long audioId,
            @RequestBody UpdateAudioRequest request
    ) {
        try {
            Audio audio = audioService.updateAudio(audioId, request);
            return Result.success("音频更新成功", audio);
        } catch (Exception e) {
            return Result.error("音频更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除音频", description = "删除指定音频")
    public Result<String> deleteAudio(@PathVariable("id") Long audioId) {
        try {
            audioService.deleteAudio(audioId);
            return Result.success("音频删除成功");
        } catch (Exception e) {
            return Result.error("音频删除失败: " + e.getMessage());
        }
    }

    @GetMapping("/creator/{creatorId}")
    @Operation(summary = "根据创作者查询音频")
    public Result<List<Audio>> getAudiosByCreatorId(@PathVariable Long creatorId) {
        try {
            return Result.success(audioService.getAudiosByCreatorId(creatorId));
        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "根据分类查询音频")
    public Result<List<Audio>> getAudiosByCategory(@PathVariable String category) {
        try {
            return Result.success(audioService.getAudiosByCategory(category));
        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @Operation(summary = "搜索音频", description = "根据关键词搜索音频")
    public Result<List<Audio>> searchAudios(@RequestParam String keyword) {
        try {
            return Result.success(audioService.searchAudios(keyword));
        } catch (Exception e) {
            return Result.error("搜索失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/play")
    @Operation(summary = "增加播放次数")
    public Result<String> incrementPlayCount(@PathVariable("id") Long audioId) {
        try {
            audioService.incrementPlayCount(audioId);
            return Result.success("播放次数增加成功");
        } catch (Exception e) {
            return Result.error("操作失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "点赞音频")
    public Result<String> incrementLikeCount(@PathVariable("id") Long audioId) {
        try {
            audioService.incrementLikeCount(audioId);
            return Result.success("点赞成功");
        } catch (Exception e) {
            return Result.error("点赞失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/unlike")
    @Operation(summary = "取消点赞")
    public Result<String> decrementLikeCount(@PathVariable("id") Long audioId) {
        try {
            audioService.decrementLikeCount(audioId);
            return Result.success("取消点赞成功");
        } catch (Exception e) {
            return Result.error("取消点赞失败: " + e.getMessage());
        }
    }
}
