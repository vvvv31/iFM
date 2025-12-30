package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.user.UserHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserHistoryRepository extends JpaRepository<UserHistory, Long> {

    // 查询某个用户的历史记录
    List<UserHistory> findByUserId(Long userId);

    // 查询某个用户某个音频的历史
    List<UserHistory> findByUserIdAndAudioId(Long userId, Long audioId);
}
