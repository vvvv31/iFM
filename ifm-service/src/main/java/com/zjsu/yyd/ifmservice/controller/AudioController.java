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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/audios")
@Tag(name = "音频接口", description = "音频上传、查看、播放接口")
public class AudioController {

    @Autowired
    private AudioService audioService;

    @Operation(summary = "上传音频（含歌词）", description = "上传音频文件和可选歌词文件")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "上传成功"),
            @ApiResponse(responseCode = "400", description = "上传失败")
    })
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<AudioDTO> upload(
            @Parameter(description = "音频文件", required = true)
            @RequestPart("file") MultipartFile file,
            @Parameter(description = "歌词文件", required = false)
            @RequestPart(value = "lyric", required = false) MultipartFile lyric,
            @RequestParam("title") String title,
            @RequestParam("programId") Long programId
    ) {
        try {
            Audio audio = audioService.upload(file, lyric, title, programId);
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

    @Operation(summary = "播放音频")
    @GetMapping("/play/{id}")
    public ResponseEntity<Resource> play(@PathVariable Long id) {
        Audio audio = audioService.get(id);
        FileSystemResource resource = new FileSystemResource(audio.getFilePath());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @Operation(summary = "获取歌词文本")
    @GetMapping("/lyric/{id}")
    public ResponseEntity<Resource> getLyric(@PathVariable Long id) {
        Audio audio = audioService.get(id);
        if (audio.getLyricPath() == null) {
            return ResponseEntity.notFound().build();
        }
        FileSystemResource resource = new FileSystemResource(audio.getLyricPath());
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(resource);
    }
}
