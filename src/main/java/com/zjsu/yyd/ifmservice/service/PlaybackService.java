package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.playback.PlaybackSetting;
import com.zjsu.yyd.ifmservice.model.playback.ProgressRecord;
import com.zjsu.yyd.ifmservice.repository.PlaybackSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PlaybackService {
    private final PlaybackSettingRepository repository;

    // 获取播放设置
    public PlaybackSetting getPlaybackSetting(Long userId) {
        return repository.findByUserId(userId)
                .orElseGet(() -> {
                    // 如果不存在，创建默认设置
                    PlaybackSetting defaultSetting = new PlaybackSetting();
                    defaultSetting.setUserId(userId);
                    return repository.save(defaultSetting);
                });
    }

    // 更新播放设置
    public PlaybackSetting updatePlaybackSetting(PlaybackSetting setting) {
        // 验证速度范围
        if (setting.getSpeed() != null &&
                (setting.getSpeed() < 0.5f || setting.getSpeed() > 1.5f)) {
            throw new IllegalArgumentException("播放速度必须在0.5-1.5之间");
        }

        // 验证循环次数
        if (setting.getLoopCount() != null && setting.getLoopCount() < 1) {
            throw new IllegalArgumentException("循环次数必须大于0");
        }

        return repository.save(setting);
    }

    // 记录播放进度（简化版：只记录到日志，后续可存入数据库）
    public void recordProgress(ProgressRecord record) {
        System.out.printf("用户 %d 内容 %d 进度：%d/%d 秒，状态：%s%n",
                record.getUserId(),
                record.getContentId(),
                record.getProgressSeconds(),
                record.getTotalSeconds(),
                record.getStatus()
        );
    }
}