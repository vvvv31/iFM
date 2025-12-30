package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.Comment;
import com.zjsu.yyd.ifmservice.model.Post;
import com.zjsu.yyd.ifmservice.model.Result;
import com.zjsu.yyd.ifmservice.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Operation(summary = "创建新动态")
    @PostMapping
    public Result<Post> create(@RequestBody Post post) {
        return Result.success(postService.create(post));
    }

    @Operation(summary = "获取所有动态")
    @GetMapping
    public Result<List<Post>> list() {
        return Result.success(postService.list());
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
