package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.DailySentenceAudio;
import com.zjsu.yyd.ifmservice.model.DailySentenceAudioDTO;
import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.SpeechScoreResult;
import com.zjsu.yyd.ifmservice.service.DailySentenceAudioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/daily-sentence-audios")
@Tag(name = "每日一句音频接口", description = "学生朗读每日一句的音频增删改查接口（带评分细项）")
public class DailySentenceAudioController {

    @Autowired
    private DailySentenceAudioService dailySentenceAudioService;

    @Operation(summary = "上传音频并创建记录")
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public Result<DailySentenceAudio> upload(
            @RequestParam("audioFile") MultipartFile audioFile,
            @RequestParam("dailySentenceId") Long dailySentenceId,
            @RequestParam("userId") Long userId
    ) {
        return Result.success(
                dailySentenceAudioService.create(audioFile, dailySentenceId, userId)
        );
    }

    @Operation(summary = "获取所有音频记录")
    @GetMapping
    public Result<List<DailySentenceAudio>> list() {
        return Result.success(dailySentenceAudioService.list());
    }

    @Operation(summary = "根据 ID 获取音频记录")
    @GetMapping("/{id}")
    public Result<DailySentenceAudio> detail(@PathVariable Long id) {
        return Result.success(dailySentenceAudioService.get(id));
    }

    @Operation(summary = "更新音频记录")
    @PutMapping("/{id}")
    public Result<DailySentenceAudio> update(@PathVariable Long id,
                                             @RequestBody DailySentenceAudioDTO dto) {
        return Result.success(dailySentenceAudioService.update(id, dto));
    }

    @Operation(summary = "删除音频记录")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        dailySentenceAudioService.delete(id);
        return Result.success(null);
    }

    @Operation(summary = "根据每日一句 ID 获取所有音频")
    @GetMapping("/daily-sentence/{dailySentenceId}")
    public Result<List<DailySentenceAudio>> listByDailySentenceId(@PathVariable Long dailySentenceId) {
        return Result.success(dailySentenceAudioService.listByDailySentenceId(dailySentenceId));
    }

    @Operation(summary = "根据用户 ID 获取所有音频")
    @GetMapping("/user/{userId}")
    public Result<List<DailySentenceAudio>> listByUserId(@PathVariable Long userId) {
        return Result.success(dailySentenceAudioService.listByUserId(userId));
    }

//    @Operation(summary = "根据音频ID进行自动评分")
//    @GetMapping("/{id}/evaluate")
//    public Result<SpeechScoreResult> evaluate(@PathVariable Long id) {
//        return Result.success(dailySentenceAudioService.evaluate(id));
//    }
}
