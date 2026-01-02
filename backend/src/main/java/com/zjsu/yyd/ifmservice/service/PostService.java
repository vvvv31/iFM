package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.Comment;
import com.zjsu.yyd.ifmservice.model.Post;
import com.zjsu.yyd.ifmservice.model.user.User;
import com.zjsu.yyd.ifmservice.repository.PostRepository;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // 创建新动态
    public Post create(Post post) {
        // 从数据库查询用户名
        User user = userRepository.findById(post.getUserId()).orElse(null);
        if (user != null && user.getUsername() != null) {
            post.setAuthor(user.getUsername());
        } else {
            post.setAuthor("用户" + post.getUserId());
        }

        // 确保 images 字符串不为 null（TEXT 字段）
        if (post.getImages() == null) {
            post.setImages("");
        }

        // 确保评论列表不为null
        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }

        // 确保标签列表不为null
        if (post.getTags() == null) {
            post.setTags(new ArrayList<>());
        }

        return postRepository.save(post);
    }

    // 获取所有动态
    public List<Post> list() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        // 确保每个 post 的集合字段不为 null
        posts.forEach(post -> {
            if (post.getImages() == null) {
                post.setImages("");
            }
            if (post.getComments() == null) {
                post.setComments(new ArrayList<>());
            }
            if (post.getTags() == null) {
                post.setTags(new ArrayList<>());
            }
        });
        return posts;
    }

    // 根据ID获取动态
    public Post get(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 确保集合字段不为 null
        if (post.getImages() == null) {
            post.setImages("");
        }
        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        if (post.getTags() == null) {
            post.setTags(new ArrayList<>());
        }

        return post;
    }

    // 根据用户ID获取用户发布的动态
    public List<Post> listByUserId(Long userId) {
        List<Post> posts = postRepository.findByUserId(userId);
        // 确保每个 post 的集合字段不为 null
        posts.forEach(post -> {
            if (post.getImages() == null) {
                post.setImages("");
            }
            if (post.getComments() == null) {
                post.setComments(new ArrayList<>());
            }
            if (post.getTags() == null) {
                post.setTags(new ArrayList<>());
            }
        });
        return posts;
    }

    // 更新动态
    public Post update(Long id, Post post) {
        Post existingPost = get(id);
        existingPost.setText(post.getText());

        // 更新图片字符串
        if (post.getImages() != null) {
            existingPost.setImages(post.getImages());
        }

        // 更新标签列表
        if (post.getTags() != null) {
            existingPost.setTags(post.getTags());
        }

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

    // 添加评论
    public Post addComment(Long postId, Comment comment) {
        Post post = get(postId);
        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        post.getComments().add(comment);
        return postRepository.save(post);
    }
}