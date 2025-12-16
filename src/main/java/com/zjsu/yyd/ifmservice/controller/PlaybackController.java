package com.zjsu.yyd.ifmservice.controller;

import com.zjsu.yyd.ifmservice.model.playback.PlaybackSetting;
import com.zjsu.yyd.ifmservice.model.playback.ProgressRecord;
import com.zjsu.yyd.ifmservice.service.PlaybackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/playback_settings")
@RequiredArgsConstructor
public class PlaybackController {
    private final PlaybackService service;

    // 获取播放设置
    @GetMapping("")
    public PlaybackSetting getPlaybackSetting(@RequestParam Long user_id) {
        return service.getPlaybackSetting(user_id);
    }

    // 更新播放设置
    @PostMapping("/update")
    public PlaybackSetting updatePlaybackSetting(@RequestBody PlaybackSetting setting) {
        return service.updatePlaybackSetting(setting);
    }

    // 记录播放进度
    @PostMapping("/record_progress")
    public String recordProgress(@RequestBody ProgressRecord record) {
        service.recordProgress(record);
        return "进度记录成功";
    }
}