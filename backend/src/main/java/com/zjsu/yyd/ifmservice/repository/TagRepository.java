package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 标签仓库
 * 提供标签增删改查操作
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    // 可根据 name 查询标签
    Tag findByName(String name);
}
