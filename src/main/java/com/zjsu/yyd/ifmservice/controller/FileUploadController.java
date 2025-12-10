package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@Tag(name = "文件上传", description = "文件上传相关接口")
public class FileUploadController {

    private final FileUploadService fileUploadService;
    
    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    /**
     * 上传音频文件
     */
    @PostMapping("/audio")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "上传音频文件", description = "上传音频文件并返回文件URL")
    public Result<Map<String, String>> uploadAudio(@RequestParam("file") MultipartFile file) {
        try {
            String audioUrl = fileUploadService.uploadAudio(file);
            Map<String, String> result = new HashMap<>();
            result.put("audioUrl", audioUrl);
            return Result.success("音频文件上传成功", result);
        } catch (IOException e) {
            return Result.error("音频文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 上传封面图片
     */
    @PostMapping("/cover")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "上传封面图片", description = "上传封面图片并返回文件URL")
    public Result<Map<String, String>> uploadCover(@RequestParam("file") MultipartFile file) {
        try {
            String coverUrl = fileUploadService.uploadCover(file);
            Map<String, String> result = new HashMap<>();
            result.put("coverUrl", coverUrl);
            return Result.success("封面图片上传成功", result);
        } catch (IOException e) {
            return Result.error("封面图片上传失败: " + e.getMessage());
        }
    }
}