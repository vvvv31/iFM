package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.AudioDTO;
import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.audio.Audio;
import com.zjsu.yyd.ifmservice.service.AudioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/audios")
@Tag(name = "音频接口（版本2）", description = "音频上传、播放、歌词查看接口")
public class AudioControllerV2 {

    private final AudioService audioService;

    public AudioControllerV2(AudioService audioService) {
        this.audioService = audioService;
    }

    @Operation(summary = "上传课程音频（含歌词）", description = "上传课程音频文件和可选歌词文件")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "上传成功"),
            @ApiResponse(responseCode = "400", description = "上传失败")
    })
    @PostMapping(value = "/upload/course", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<AudioDTO> uploadCourseAudio(
            @Parameter(description = "音频文件", required = true)
            @RequestPart("file") MultipartFile file,
            @Parameter(description = "歌词文件", required = false)
            @RequestPart(value = "lyric", required = false) MultipartFile lyric,
            @RequestParam("title") String title,
            @RequestParam("programId") Long programId
    ) {
        try {
            Audio audio = audioService.uploadCourseAudio(file, lyric, title, programId);
            return Result.success(audioService.convertToDTO(audio));
        } catch (Exception e) {
            return Result.error("上传失败: " + e.getMessage());
        }
    }

    @Operation(summary = "上传单独音频（含歌词）", description = "用户上传的单独音频文件")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "上传成功"),
            @ApiResponse(responseCode = "400", description = "上传失败")
    })
    @PostMapping(value = "/upload/simple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<AudioDTO> uploadSimpleAudio(
            @Parameter(description = "音频文件", required = true)
            @RequestPart("file") MultipartFile file,
            @Parameter(description = "歌词文件", required = false)
            @RequestPart(value = "lyric", required = false) MultipartFile lyric,
            @RequestParam("title") String title,
            @RequestParam("userId") Long userId
    ) {
        try {
            Audio audio = audioService.uploadSimpleAudio(file, lyric, title, userId);
            return Result.success(audioService.convertToDTO(audio));
        } catch (Exception e) {
            return Result.error("上传失败: " + e.getMessage());
        }
    }

    @Operation(summary = "查看某课程下所有音频")
    @GetMapping("/program/{programId}")
    public Result<List<AudioDTO>> listByProgram(@PathVariable Long programId) {
        return Result.success(audioService.listByProgramDTO(programId));
    }

    @Operation(summary = "查看用户上传的所有单独音频")
    @GetMapping("/simple/{userId}")
    public Result<List<AudioDTO>> listSimpleAudios(@PathVariable Long userId) {
        return Result.success(audioService.listSimpleAudiosByUserId(userId));
    }

    @Operation(summary = "播放音频")
    @GetMapping("/play/{id}")
    public ResponseEntity<Resource> play(@PathVariable Long id) {
        Audio audio = audioService.get(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new FileSystemResource(audio.getFilePath()));
    }

    @Operation(summary = "获取歌词文本")
    @GetMapping("/lyric/{id}")
    public ResponseEntity<Resource> getLyric(@PathVariable Long id) {
        Audio audio = audioService.get(id);
        if (audio.getLyricPath() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(new FileSystemResource(audio.getLyricPath()));
    }
}
