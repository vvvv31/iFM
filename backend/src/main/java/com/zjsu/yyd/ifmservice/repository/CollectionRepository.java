package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.collection.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {

    /**
     * 检查用户是否已经收藏了目标内容
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型
     * @return 是否收藏
     */
    boolean existsByUserIdAndTargetIdAndTargetType(Long userId, Long targetId, String targetType);

    /**
     * 根据用户ID和目标信息删除收藏
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型
     */
    @Modifying
    @Query("DELETE FROM Collection c WHERE c.userId = ?1 AND c.targetId = ?2 AND c.targetType = ?3")
    void deleteByUserIdAndTargetIdAndTargetType(Long userId, Long targetId, String targetType);

    /**
     * 根据用户ID获取收藏列表
     * @param userId 用户ID
     * @return 收藏列表
     */
    List<Collection> findByUserId(Long userId);

    /**
     * 根据用户ID和目标类型获取收藏列表
     * @param userId 用户ID
     * @param targetType 目标类型
     * @return 收藏列表
     */
    List<Collection> findByUserIdAndTargetType(Long userId, String targetType);
}