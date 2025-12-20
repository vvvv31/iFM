package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.AudioDTO;
import com.zjsu.yyd.ifmservice.model.Program;
import com.zjsu.yyd.ifmservice.model.audio.Audio;
import com.zjsu.yyd.ifmservice.model.audio.CreateAudioRequest;
import com.zjsu.yyd.ifmservice.model.audio.UpdateAudioRequest;
import com.zjsu.yyd.ifmservice.repository.AudioRepository;
import com.zjsu.yyd.ifmservice.repository.ProgramRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AudioService {

    private final AudioRepository audioRepository;
    private final ProgramRepository programRepository;
    private final FileService fileService; // 统一处理文件上传（音频/歌词）

    // 构造函数
    public AudioService(AudioRepository audioRepository, ProgramRepository programRepository, FileService fileService) {
        this.audioRepository = audioRepository;
        this.programRepository = programRepository;
        this.fileService = fileService;
    }

    /**
     * 创建音频 - 版本1
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
     * 根据ID查询音频详情 - 版本1
     */
    public Audio getAudioById(Long audioId) {
        return audioRepository.findById(audioId)
                .orElseThrow(() -> new RuntimeException("音频不存在"));
    }

    /**
     * 根据ID查询音频详情 - 版本2（兼容前端get方法）
     */
    public Audio get(Long audioId) {
        return getAudioById(audioId);
    }

    /**
     * 更新音频信息 - 版本1
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
     * 删除音频 - 版本1
     */
    public void deleteAudio(Long audioId) {
        Audio audio = getAudioById(audioId);
        audioRepository.delete(audio);
    }

    /**
     * 根据创作者ID查询音频列表 - 版本1
     */
    public List<Audio> getAudiosByCreatorId(Long creatorId) {
        return audioRepository.findByCreatorId(creatorId);
    }

    /**
     * 根据分类查询音频列表 - 版本1
     */
    public List<Audio> getAudiosByCategory(String category) {
        return audioRepository.findByCategory(category);
    }

    /**
     * 搜索音频 - 版本1
     */
    public List<Audio> searchAudios(String keyword) {
        return audioRepository.findByTitleContaining(keyword);
    }

    /**
     * 增加播放次数 - 版本1
     */
    public void incrementPlayCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        audio.setPlayCount(audio.getPlayCount() + 1);
        audioRepository.save(audio);
    }

    /**
     * 增加点赞次数 - 版本1
     */
    public void incrementLikeCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        audio.setLikeCount(audio.getLikeCount() + 1);
        audioRepository.save(audio);
    }

    /**
     * 减少点赞次数 - 版本1
     */
    public void decrementLikeCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        if (audio.getLikeCount() > 0) {
            audio.setLikeCount(audio.getLikeCount() - 1);
            audioRepository.save(audio);
        }
    }

    /**
     * 上传课程音频（可含歌词） - 版本2
     * 目录结构：课程ID/音频ID
     */
    public Audio uploadCourseAudio(MultipartFile file, MultipartFile lyric, String title, Long programId) throws Exception {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("program not found"));

        // 课程音频使用复杂目录结构：课程ID/音频标题
        String folderName = "course/" + programId + "/" + title;
        String audioPath = fileService.saveFile(file, folderName);
        String lyricPath = null;
        if (lyric != null) {
            lyricPath = fileService.saveFile(lyric, folderName);
        }

        Audio audio = new Audio();
        audio.setTitle(title);
        audio.setFilePath(audioPath);
        audio.setLyricPath(lyricPath);
        audio.setProgram(program);

        return audioRepository.save(audio);
    }

    /**
     * 上传单独音频（可含歌词） - 版本2
     * 目录结构：simple/用户ID/音频ID
     */
    public Audio uploadSimpleAudio(MultipartFile file, MultipartFile lyric, String title, Long userId) throws Exception {
        // 单独音频使用简单目录结构：simple/用户ID/音频标题
        String folderName = "simple/" + userId + "/" + title;
        String audioPath = fileService.saveFile(file, folderName);
        String lyricPath = null;
        if (lyric != null) {
            lyricPath = fileService.saveFile(lyric, folderName);
        }

        Audio audio = new Audio();
        audio.setTitle(title);
        audio.setFilePath(audioPath);
        audio.setLyricPath(lyricPath);
        audio.setCreatorId(userId);

        return audioRepository.save(audio);
    }

    /**
     * 查询某课程下所有音频 - 版本2
     */
    public List<AudioDTO> listByProgramDTO(Long programId) {
        return audioRepository.findByProgramProgramId(programId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 查询用户上传的所有单独音频 - 版本2
     */
    public List<AudioDTO> listSimpleAudiosByUserId(Long userId) {
        return audioRepository.findByCreatorId(userId)
                .stream()
                .filter(audio -> audio.getProgram() == null) // 只返回未关联课程的音频
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 转换为 DTO - 版本2
     */
    public AudioDTO convertToDTO(Audio audio) {
        AudioDTO dto = new AudioDTO();
        dto.setAudioId(audio.getAudioId());
        dto.setTitle(audio.getTitle());
        dto.setFilePath(audio.getFilePath());
        dto.setLyricPath(audio.getLyricPath());
        if (audio.getProgram() != null) {
            dto.setProgramId(audio.getProgram().getProgramId());
            dto.setProgramTitle(audio.getProgram().getTitle());
        }
        return dto;
    }
}