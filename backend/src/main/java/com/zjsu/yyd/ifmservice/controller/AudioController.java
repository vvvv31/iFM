package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.AudioDTO;
import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.model.audio.Audio;
import com.zjsu.yyd.ifmservice.model.audio.CreateAudioRequest;
import com.zjsu.yyd.ifmservice.model.audio.UpdateAudioRequest;
import com.zjsu.yyd.ifmservice.service.AudioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Tag(name = "音频管理", description = "音频内容管理相关接口")
public class AudioController {

    private final AudioService audioService;
    
    // 构造函数
    public AudioController(AudioService audioService) {
        this.audioService = audioService;
    }

    // --------------------- 版本1接口 (/api/audio) ---------------------

    @RequestMapping("/api/audio")
    @Tag(name = "音频管理（版本1）", description = "音频内容管理相关接口")
    public class AudioControllerV1 {

        /**
         * 创建音频
         */
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

        /**
         * 获取音频详情
         */
        @GetMapping("/{id}")
        @Operation(summary = "获取音频详情", description = "根据ID获取音频详细信息")
        public Result<Audio> getAudioById(@PathVariable("id") Long audioId) {
            try {
                Audio audio = audioService.getAudioById(audioId);
                return Result.success("音频查询成功", audio);
            } catch (Exception e) {
                return Result.error("音频查询失败: " + e.getMessage());
            }
        }

        /**
         * 更新音频
         */
        @PutMapping("/{id}")
        @Operation(summary = "更新音频", description = "更新音频信息")
        public Result<Audio> updateAudio(@PathVariable("id") Long audioId, @RequestBody UpdateAudioRequest request) {
            try {
                Audio audio = audioService.updateAudio(audioId, request);
                return Result.success("音频更新成功", audio);
            } catch (Exception e) {
                return Result.error("音频更新失败: " + e.getMessage());
            }
        }

        /**
         * 删除音频
         */
        @DeleteMapping("/{id}")
        @Operation(summary = "删除音频", description = "删除音频内容")
        public Result<String> deleteAudio(@PathVariable("id") Long audioId) {
            try {
                audioService.deleteAudio(audioId);
                return Result.success("音频删除成功");
            } catch (Exception e) {
                return Result.error("音频删除失败: " + e.getMessage());
            }
        }

        /**
         * 根据创作者ID查询音频列表
         */
        @GetMapping("/creator/{creatorId}")
        @Operation(summary = "根据创作者查询音频", description = "根据创作者ID获取音频列表")
        public Result<List<Audio>> getAudiosByCreatorId(@PathVariable Long creatorId) {
            try {
                List<Audio> audios = audioService.getAudiosByCreatorId(creatorId);
                return Result.success("音频查询成功", audios);
            } catch (Exception e) {
                return Result.error("音频查询失败: " + e.getMessage());
            }
        }

        /**
         * 根据分类查询音频列表
         */
        @GetMapping("/category/{category}")
        @Operation(summary = "根据分类查询音频", description = "根据分类获取音频列表")
        public Result<List<Audio>> getAudiosByCategory(@PathVariable String category) {
            try {
                List<Audio> audios = audioService.getAudiosByCategory(category);
                return Result.success("音频查询成功", audios);
            } catch (Exception e) {
                return Result.error("音频查询失败: " + e.getMessage());
            }
        }

        /**
         * 搜索音频
         */
        @GetMapping("/search")
        @Operation(summary = "搜索音频", description = "根据关键词搜索音频")
        public Result<List<Audio>> searchAudios(@RequestParam String keyword) {
            try {
                List<Audio> audios = audioService.searchAudios(keyword);
                return Result.success("音频搜索成功", audios);
            } catch (Exception e) {
                return Result.error("音频搜索失败: " + e.getMessage());
            }
        }

        /**
         * 增加播放次数
         */
        @PostMapping("/{id}/play")
        @Operation(summary = "增加播放次数", description = "增加音频的播放次数")
        public Result<String> incrementPlayCount(@PathVariable("id") Long audioId) {
            try {
                audioService.incrementPlayCount(audioId);
                return Result.success("播放次数增加成功");
            } catch (Exception e) {
                return Result.error("播放次数增加失败: " + e.getMessage());
            }
        }

        /**
         * 增加点赞次数
         */
        @PostMapping("/{id}/like")
        @Operation(summary = "点赞音频", description = "增加音频的点赞次数")
        public Result<String> incrementLikeCount(@PathVariable("id") Long audioId) {
            try {
                audioService.incrementLikeCount(audioId);
                return Result.success("点赞成功");
            } catch (Exception e) {
                return Result.error("点赞失败: " + e.getMessage());
            }
        }

        /**
         * 减少点赞次数
         */
        @PostMapping("/{id}/unlike")
        @Operation(summary = "取消点赞", description = "减少音频的点赞次数")
        public Result<String> decrementLikeCount(@PathVariable("id") Long audioId) {
            try {
                audioService.decrementLikeCount(audioId);
                return Result.success("取消点赞成功");
            } catch (Exception e) {
                return Result.error("取消点赞失败: " + e.getMessage());
            }
        }
    }

    // --------------------- 版本2接口 (/audios) ---------------------

    @RequestMapping("/audios")
    @Tag(name = "音频接口（版本2）", description = "音频上传、查看、播放接口")
    public class AudioControllerV2 {

        @Operation(summary = "上传课程音频（含歌词）", description = "上传课程音频文件和可选歌词文件，目录结构较为复杂")
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

        @Operation(summary = "上传单独音频（含歌词）", description = "普通用户直接上传的单独音频文件和可选歌词文件")
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
}