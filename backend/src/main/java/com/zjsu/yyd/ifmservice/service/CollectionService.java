package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.collection.Collection;
import com.zjsu.yyd.ifmservice.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CollectionService {

    @Autowired
    private CollectionRepository collectionRepository;

    /**
     * 添加收藏
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型（program或episode）
     * @return 是否添加成功
     */
    @Transactional
    public boolean addCollection(Long userId, Long targetId, String targetType) {
        // 检查是否已经收藏
        if (collectionRepository.existsByUserIdAndTargetIdAndTargetType(userId, targetId, targetType)) {
            return false; // 已经收藏
        }

        // 创建收藏记录
        Collection collection = new Collection();
        collection.setUserId(userId);
        collection.setTargetId(targetId);
        collection.setTargetType(targetType);
        collectionRepository.save(collection);
        return true;
    }

    /**
     * 取消收藏
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型（program或episode）
     * @return 是否取消成功
     */
    @Transactional
    public boolean removeCollection(Long userId, Long targetId, String targetType) {
        // 检查是否已经收藏
        if (!collectionRepository.existsByUserIdAndTargetIdAndTargetType(userId, targetId, targetType)) {
            return false; // 未收藏
        }

        // 删除收藏记录
        collectionRepository.deleteByUserIdAndTargetIdAndTargetType(userId, targetId, targetType);
        return true;
    }

    /**
     * 检查是否收藏
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型（program或episode）
     * @return 是否已收藏
     */
    public boolean checkCollection(Long userId, Long targetId, String targetType) {
        return collectionRepository.existsByUserIdAndTargetIdAndTargetType(userId, targetId, targetType);
    }

    /**
     * 获取用户收藏列表
     * @param userId 用户ID
     * @return 收藏列表
     */
    public List<Collection> getCollectionList(Long userId) {
        return collectionRepository.findByUserId(userId);
    }

    /**
     * 获取用户收藏的节目列表
     * @param userId 用户ID
     * @return 节目收藏列表
     */
    public List<Collection> getProgramCollectionList(Long userId) {
        return collectionRepository.findByUserIdAndTargetType(userId, "program");
    }

    /**
     * 获取用户收藏的集数列表
     * @param userId 用户ID
     * @return 集数收藏列表
     */
    public List<Collection> getEpisodeCollectionList(Long userId) {
        return collectionRepository.findByUserIdAndTargetType(userId, "episode");
    }
}