package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.Comment;
import com.zjsu.yyd.ifmservice.model.Post;
import com.zjsu.yyd.ifmservice.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // 创建新动态
    public Post create(Post post) {
        return postRepository.save(post);
    }

    // 获取所有动态
    public List<Post> list() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // 根据ID获取动态
    public Post get(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // 根据用户ID获取用户发布的动态
    public List<Post> listByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    // 更新动态
    public Post update(Long id, Post post) {
        Post existingPost = get(id);
        existingPost.setText(post.getText());
        existingPost.setImages(post.getImages());
        existingPost.setTags(post.getTags());
        return postRepository.save(existingPost);
    }

    // 删除动态
    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    // 增加点赞数
    public Post incrementLikeCount(Long id) {
        Post post = get(id);
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }

    // 减少点赞数
    public Post decrementLikeCount(Long id) {
        Post post = get(id);
        if (post.getLikes() > 0) {
            post.setLikes(post.getLikes() - 1);
            return postRepository.save(post);
        }
        return post;
    }

    public Post addComment(Long postId, Comment comment) {
        Post post = get(postId);
        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        post.getComments().add(comment);
        return postRepository.save(post);
    }
}
