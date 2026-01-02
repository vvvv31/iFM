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
     * 上传帖子图片
     */
    @PostMapping("/post-image")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "上传帖子图片")
    public Result<Map<String, String>> uploadPostImage(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("=== 收到帖子图片上传请求 ===");
            System.out.println("文件名: " + file.getOriginalFilename());
            System.out.println("文件大小: " + file.getSize());

            String imageUrl = fileUploadService.uploadPostImage(file);

            System.out.println("✅ 上传完成，返回 URL: " + imageUrl);

            // ✅ 返回包含 url、path、filename 的对象
            Map<String, String> result = new HashMap<>();
            result.put("url", imageUrl); // /uploads/posts/xxx.png
            result.put("path", imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl); // uploads/posts/xxx.png
            result.put("filename", file.getOriginalFilename());

            System.out.println("返回数据: " + result);

            return Result.success(result);

        } catch (IOException e) {
            System.err.println("❌ 图片上传失败: " + e.getMessage());
            e.printStackTrace();
            return Result.error("图片上传失败: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ 未知错误: " + e.getMessage());
            e.printStackTrace();
            return Result.error("上传失败: " + e.getMessage());
        }
    }

    /**
     * 上传音频文件
     */
    @PostMapping("/audio")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "上传音频文件")
    public Result<Map<String, String>> uploadAudio(@RequestParam("file") MultipartFile file) {
        try {
            String audioUrl = fileUploadService.uploadAudio(file);
            Map<String, String> result = new HashMap<>();
            result.put("audioUrl", audioUrl);
            return Result.success(result);
        } catch (IOException e) {
            return Result.error("音频文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 上传封面图片
     */
    @PostMapping("/cover")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "上传封面图片")
    public Result<Map<String, String>> uploadCover(@RequestParam("file") MultipartFile file) {
        try {
            String coverUrl = fileUploadService.uploadCover(file);
            Map<String, String> result = new HashMap<>();
            result.put("coverUrl", coverUrl);
            return Result.success(result);
        } catch (IOException e) {
            return Result.error("封面图片上传失败: " + e.getMessage());
        }
    }
}