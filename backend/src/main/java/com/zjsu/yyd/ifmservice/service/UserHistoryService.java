package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.user.UserHistory;
import com.zjsu.yyd.ifmservice.repository.UserHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserHistoryService {

    private final UserHistoryRepository userHistoryRepository;

    public UserHistoryService(UserHistoryRepository userHistoryRepository) {
        this.userHistoryRepository = userHistoryRepository;
    }

    // ==================== 新增 ====================

    public UserHistory createHistory(Long userId, Long audioId) {
        UserHistory history = new UserHistory();
        history.setUserId(userId);
        history.setAudioId(audioId);
        history.setListenedAt(LocalDateTime.now());
        return userHistoryRepository.save(history);
    }

    // ==================== 查询 ====================

    public UserHistory getById(Long id) {
        return userHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("历史记录不存在"));
    }

    public List<UserHistory> listByUserId(Long userId) {
        return userHistoryRepository.findByUserId(userId);
    }

    public List<UserHistory> listByUserAndAudio(Long userId, Long audioId) {
        return userHistoryRepository.findByUserIdAndAudioId(userId, audioId);
    }

    // ==================== 修改 ====================

    public UserHistory updateListenedAt(Long id, LocalDateTime listenedAt) {
        UserHistory history = getById(id);
        history.setListenedAt(listenedAt);
        return userHistoryRepository.save(history);
    }

    // ==================== 删除 ====================

    public void deleteById(Long id) {
        if (!userHistoryRepository.existsById(id)) {
            throw new RuntimeException("历史记录不存在");
        }
        userHistoryRepository.deleteById(id);
    }

    public void deleteByUserId(Long userId) {
        List<UserHistory> histories = userHistoryRepository.findByUserId(userId);
        userHistoryRepository.deleteAll(histories);
    }
}
