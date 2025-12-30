package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // 根据用户ID查询用户发布的动态
    List<Post> findByUserId(Long userId);
    
    // 查询所有动态，按创建时间倒序排列
    List<Post> findAllByOrderByCreatedAtDesc();
}
