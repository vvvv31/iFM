package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Comment;
import com.zjsu.yyd.ifmservice.model.Post;
import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Operation(summary = "创建新动态")
    @PostMapping
    public Result<Post> create(@RequestBody Map<String, Object> requestBody) {
        try {
            System.out.println("=== 收到创建帖子请求 ===");
            System.out.println("请求体: " + requestBody);

            Post post = new Post();
            post.setUserId(((Number) requestBody.get("userId")).longValue());
            post.setText((String) requestBody.get("text"));

            // 处理图片数组
            Object imagesObj = requestBody.get("images");
            System.out.println("images 原始值: " + imagesObj);
            System.out.println("images 类型: " + (imagesObj != null ? imagesObj.getClass().getName() : "null"));

            if (imagesObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> imageList = (List<String>) imagesObj;
                System.out.println("图片列表大小: " + imageList.size());
                System.out.println("图片列表内容: " + imageList);

                // ✅ 转换为逗号分隔的字符串存储
                if (!imageList.isEmpty()) {
                    // 过滤掉空值
                    List<String> validImages = imageList.stream()
                            .filter(url -> url != null && !url.trim().isEmpty())
                            .collect(java.util.stream.Collectors.toList());

                    if (!validImages.isEmpty()) {
                        String imagesString = String.join(",", validImages);
                        System.out.println("转换后的 images 字符串: " + imagesString);
                        post.setImages(imagesString);
                    } else {
                        post.setImages("");
                    }
                } else {
                    post.setImages("");
                }
            } else if (imagesObj instanceof String) {
                post.setImages((String) imagesObj);
            } else {
                post.setImages("");
            }

            post.setLikes((Integer) requestBody.getOrDefault("likes", 0));

            Post savedPost = postService.create(post);
            System.out.println("保存后的帖子数据:");
            System.out.println("- ID: " + savedPost.getId());
            System.out.println("- Images: " + savedPost.getImages());
            System.out.println("- Text: " + savedPost.getText());

            return Result.success(savedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("创建帖子失败: " + e.getMessage());
        }
    }

    @Operation(summary = "获取所有动态")
    @GetMapping
    public Result<List<Post>> list() {
        List<Post> posts = postService.list();
        // 确保返回的每个 post 都有 images 列表
        posts.forEach(post -> {
            if (post.getImagesList() == null) {
                post.setImagesList(new java.util.ArrayList<>());
            }
        });
        return Result.success(posts);
    }

    @Operation(summary = "根据ID获取动态")
    @GetMapping("/{id}")
    public Result<Post> get(@PathVariable Long id) {
        return Result.success(postService.get(id));
    }

    @Operation(summary = "根据用户ID获取用户发布的动态")
    @GetMapping("/user/{userId}")
    public Result<List<Post>> listByUserId(@PathVariable Long userId) {
        return Result.success(postService.listByUserId(userId));
    }

    @Operation(summary = "更新动态")
    @PutMapping("/{id}")
    public Result<Post> update(@PathVariable Long id, @RequestBody Post post) {
        return Result.success(postService.update(id, post));
    }

    @Operation(summary = "删除动态")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return Result.success(null);
    }

    @Operation(summary = "增加动态点赞数")
    @PostMapping("/{id}/like")
    public Result<Post> like(@PathVariable Long id) {
        return Result.success(postService.incrementLikeCount(id));
    }

    @Operation(summary = "减少动态点赞数")
    @PostMapping("/{id}/unlike")
    public Result<Post> unlike(@PathVariable Long id) {
        return Result.success(postService.decrementLikeCount(id));
    }

    @Operation(summary = "添加评论")
    @PostMapping("/{id}/comments")
    public Result<Post> addComment(@PathVariable Long id, @RequestBody Comment comment) {
        return Result.success(postService.addComment(id, comment));
    }
}
