package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.audio.Audio;
import com.zjsu.yyd.ifmservice.model.audio.CreateAudioRequest;
import com.zjsu.yyd.ifmservice.model.audio.UpdateAudioRequest;
import com.zjsu.yyd.ifmservice.repository.AudioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AudioService {

    private final AudioRepository audioRepository;

    // 构造函数
    public AudioService(AudioRepository audioRepository) {
        this.audioRepository = audioRepository;
    }

    /**
     * 创建音频
     */
    public Audio createAudio(CreateAudioRequest request) {
        Audio audio = new Audio();
        audio.setTitle(request.getTitle());
        audio.setDescription(request.getDescription());
        audio.setUrl(request.getUrl());
        audio.setCoverUrl(request.getCoverUrl());
        audio.setDuration(request.getDuration());
        audio.setCreatorId(request.getCreatorId());
        audio.setCategory(request.getCategory());
        
        return audioRepository.save(audio);
    }

    /**
     * 根据ID查询音频详情
     */
    public Audio getAudioById(Long audioId) {
        return audioRepository.findById(audioId)
                .orElseThrow(() -> new RuntimeException("音频不存在"));
    }

    /**
     * 更新音频信息
     */
    public Audio updateAudio(Long audioId, UpdateAudioRequest request) {
        Audio audio = getAudioById(audioId);
        
        if (request.getTitle() != null) {
            audio.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            audio.setDescription(request.getDescription());
        }
        if (request.getUrl() != null) {
            audio.setUrl(request.getUrl());
        }
        if (request.getCoverUrl() != null) {
            audio.setCoverUrl(request.getCoverUrl());
        }
        if (request.getDuration() != null) {
            audio.setDuration(request.getDuration());
        }
        if (request.getCategory() != null) {
            audio.setCategory(request.getCategory());
        }
        
        return audioRepository.save(audio);
    }

    /**
     * 删除音频
     */
    public void deleteAudio(Long audioId) {
        Audio audio = getAudioById(audioId);
        audioRepository.delete(audio);
    }

    /**
     * 根据创作者ID查询音频列表
     */
    public List<Audio> getAudiosByCreatorId(Long creatorId) {
        return audioRepository.findByCreatorId(creatorId);
    }

    /**
     * 根据分类查询音频列表
     */
    public List<Audio> getAudiosByCategory(String category) {
        return audioRepository.findByCategory(category);
    }

    /**
     * 搜索音频
     */
    public List<Audio> searchAudios(String keyword) {
        return audioRepository.findByTitleContaining(keyword);
    }

    /**
     * 增加播放次数
     */
    public void incrementPlayCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        audio.setPlayCount(audio.getPlayCount() + 1);
        audioRepository.save(audio);
    }

    /**
     * 增加点赞次数
     */
    public void incrementLikeCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        audio.setLikeCount(audio.getLikeCount() + 1);
        audioRepository.save(audio);
    }

    /**
     * 减少点赞次数
     */
    public void decrementLikeCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        if (audio.getLikeCount() > 0) {
            audio.setLikeCount(audio.getLikeCount() - 1);
            audioRepository.save(audio);
        }
    }
}