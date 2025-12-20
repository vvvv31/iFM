package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/common")
@Tag(name = "基础公共接口", description = "提供通用功能接口")
public class CommonController {

    @Operation(summary = "通用文件上传", description = "上传音频、封面、头像等文件")
    @PostMapping("/upload")
    public Result<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {
        try {
            // 这里应该调用文件上传服务，暂时返回模拟数据
            System.out.println("上传文件：" + file.getOriginalFilename());
            System.out.println("文件类型：" + type);
            
            // 模拟上传成功后返回的文件URL
            String fileUrl = "https://example.com/files/" + file.getOriginalFilename();
            
            Map<String, Object> result = new HashMap<>();
            result.put("fileUrl", fileUrl);
            result.put("fileName", file.getOriginalFilename());
            
            return Result.success(result);
        } catch (Exception e) {
            return Result.error("文件上传失败: " + e.getMessage());
        }
    }

    @Operation(summary = "全部分类获取", description = "获取所有节目分类")
    @GetMapping("/category/list")
    public Result<Map<String, Object>> getCategoryList() {
        try {
            // 模拟分类数据
            Map<String, Object> result = new HashMap<>();
            result.put("categories", new Object[] {
                    Map.of("id", 1, "name", "音乐", "icon", "🎵"),
                    Map.of("id", 2, "name", "脱口秀", "icon", "🎤"),
                    Map.of("id", 3, "name", "新闻", "icon", "📰"),
                    Map.of("id", 4, "name", "故事", "icon", "📖"),
                    Map.of("id", 5, "name", "教育", "icon", "🎓")
            });
            return Result.success(result);
        } catch (Exception e) {
            return Result.error("获取分类失败: " + e.getMessage());
        }
    }

    @Operation(summary = "用户反馈提交", description = "提交用户反馈信息")
    @PostMapping("/feedback")
    public Result<?> submitFeedback(
            @RequestParam("content") String content,
            @RequestParam("contact") String contact,
            @RequestParam("type") String type) {
        try {
            // 这里应该将反馈信息保存到数据库，暂时只打印日志
            System.out.println("收到用户反馈：");
            System.out.println("内容：" + content);
            System.out.println("联系方式：" + contact);
            System.out.println("类型：" + type);
            return Result.success("反馈提交成功", null);
        } catch (Exception e) {
            return Result.error("反馈提交失败: " + e.getMessage());
        }
    }
}