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
        System.out.println("=== 接收到创建帖子请求 ===");
        System.out.println("请求体: " + requestBody);

        Post post = new Post();
        post.setUserId(((Number) requestBody.get("userId")).longValue());
        post.setText((String) requestBody.get("text"));

        // 处理图片数组
        Object imagesObj = requestBody.get("images");
        System.out.println("images 对象类型: " + (imagesObj != null ? imagesObj.getClass().getName() : "null"));
        System.out.println("images 值: " + imagesObj);

        if (imagesObj instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> imageList = (List<String>) imagesObj;
            System.out.println("图片URL列表: " + imageList);
            System.out.println("图片数量: " + imageList.size());

            post.setImagesList(imageList); // 使用辅助方法
        } else {
            System.out.println("images 不是 List 类型");
        }

        post.setLikes((Integer) requestBody.getOrDefault("likes", 0));

        Post savedPost = postService.create(post);
        System.out.println("保存后的图片字段: " + savedPost.getImages());

        return Result.success(savedPost);
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
