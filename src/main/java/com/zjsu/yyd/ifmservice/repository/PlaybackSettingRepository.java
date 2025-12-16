package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.playback.PlaybackSetting;
import com.zjsu.yyd.ifmservice.model.playback.PlaybackSettingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PlaybackSettingRepository extends JpaRepository<PlaybackSetting, PlaybackSettingId> {
    Optional<PlaybackSetting> findByUserId(Long userId);
}