package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.audio.AudioDTO;
import com.zjsu.yyd.ifmservice.model.program.Program;
import com.zjsu.yyd.ifmservice.model.audio.Audio;
import com.zjsu.yyd.ifmservice.model.audio.CreateAudioRequest;
import com.zjsu.yyd.ifmservice.model.audio.UpdateAudioRequest;
import com.zjsu.yyd.ifmservice.repository.AudioRepository;
import com.zjsu.yyd.ifmservice.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AudioService {

    private final AudioRepository audioRepository;
    private final ProgramRepository programRepository;

    public AudioService(AudioRepository audioRepository, ProgramRepository programRepository) {
        this.audioRepository = audioRepository;
        this.programRepository = programRepository;
    }

    @Value("${audio.upload-path}")
    private String baseUploadPath;

    // ------------------- 通用 CRUD -------------------
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

    public Audio getAudioById(Long audioId) {
        return audioRepository.findById(audioId)
                .orElseThrow(() -> new RuntimeException("音频不存在"));
    }

    public Audio get(Long audioId) {
        return getAudioById(audioId);
    }

    public Audio updateAudio(Long audioId, UpdateAudioRequest request) {
        Audio audio = getAudioById(audioId);
        if (request.getTitle() != null) audio.setTitle(request.getTitle());
        if (request.getDescription() != null) audio.setDescription(request.getDescription());
        if (request.getUrl() != null) audio.setUrl(request.getUrl());
        if (request.getCoverUrl() != null) audio.setCoverUrl(request.getCoverUrl());
        if (request.getDuration() != null) audio.setDuration(request.getDuration());
        if (request.getCategory() != null) audio.setCategory(request.getCategory());
        return audioRepository.save(audio);
    }

    public void deleteAudio(Long audioId) {
        Audio audio = getAudioById(audioId);
        audioRepository.delete(audio);
    }

    public List<Audio> getAudiosByCreatorId(Long creatorId) {
        return audioRepository.findByCreatorId(creatorId);
    }

    public List<Audio> getAudiosByCategory(String category) {
        return audioRepository.findByCategory(category);
    }

    public List<Audio> searchAudios(String keyword) {
        return audioRepository.findByTitleContaining(keyword);
    }

    public void incrementPlayCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        audio.setPlayCount(audio.getPlayCount() + 1);
        audioRepository.save(audio);
    }

    public void incrementLikeCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        audio.setLikeCount(audio.getLikeCount() + 1);
        audioRepository.save(audio);
    }

    public void decrementLikeCount(Long audioId) {
        Audio audio = getAudioById(audioId);
        if (audio.getLikeCount() > 0) {
            audio.setLikeCount(audio.getLikeCount() - 1);
            audioRepository.save(audio);
        }
    }

    // ------------------- 文件上传 -------------------

    /**
     * 上传课程音频（可含歌词） - 自动创建课程
     * 目录结构：uploads/course/{programId}/{title}
     */
    public Audio uploadCourseAudio(MultipartFile file, MultipartFile lyric, String title, Long programId) throws IOException {
        // 查询课程，如果不存在则创建
        Program program = programRepository.findById(programId)
                .orElseGet(() -> {
                    Program newProgram = new Program();
                    newProgram.setTitle("默认课程_" + programId);
                    newProgram.setCreatorId(0L); // 必填字段，避免constraint错误
                    return programRepository.save(newProgram);
                });

        // 创建目录
        Path folderPath = Paths.get(baseUploadPath, "course", String.valueOf(program.getProgramId()), title);
        if (!Files.exists(folderPath)) Files.createDirectories(folderPath);

        // 保存音频文件
        String audioFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path audioFilePath = folderPath.resolve(audioFileName);
        file.transferTo(audioFilePath.toFile());

        // 保存歌词文件（可选）
        String lyricPath = null;
        if (lyric != null) {
            String lyricFileName = System.currentTimeMillis() + "_" + lyric.getOriginalFilename();
            Path lyricFilePath = folderPath.resolve(lyricFileName);
            lyric.transferTo(lyricFilePath.toFile());
            lyricPath = lyricFilePath.toString();
        }

        // 保存数据库
        Audio audio = new Audio();
        audio.setTitle(title);
        audio.setFilePath(audioFilePath.toString());
        audio.setLyricPath(lyricPath);
        audio.setProgram(program);
        audio.setCreatorId(program.getCreatorId()); // 避免空creatorId
        audio.setUrl(audioFilePath.toString());     // 可以同步url字段
        return audioRepository.save(audio);
    }

    /**
     * 上传单独音频（可含歌词）
     * 目录结构：uploads/simple/{userId}/{title}
     */
    public Audio uploadSimpleAudio(MultipartFile file, MultipartFile lyric, String title, Long userId) throws IOException {
        Path folderPath = Paths.get(baseUploadPath, "simple", String.valueOf(userId), title);
        if (!Files.exists(folderPath)) Files.createDirectories(folderPath);

        // 保存音频文件
        String audioFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path audioFilePath = folderPath.resolve(audioFileName);
        file.transferTo(audioFilePath.toFile());

        // 保存歌词文件（可选）
        String lyricPath = null;
        if (lyric != null) {
            String lyricFileName = System.currentTimeMillis() + "_" + lyric.getOriginalFilename();
            Path lyricFilePath = folderPath.resolve(lyricFileName);
            lyric.transferTo(lyricFilePath.toFile());
            lyricPath = lyricFilePath.toString();
        }

        Audio audio = new Audio();
        audio.setTitle(title);
        audio.setFilePath(audioFilePath.toString());
        audio.setLyricPath(lyricPath);
        audio.setCreatorId(userId);
        audio.setUrl(audioFilePath.toString());
        return audioRepository.save(audio);
    }

    // ------------------- DTO -------------------
    public List<AudioDTO> listByProgramDTO(Long programId) {
        return audioRepository.findByProgramProgramId(programId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AudioDTO> listSimpleAudiosByUserId(Long userId) {
        return audioRepository.findByCreatorId(userId)
                .stream()
                .filter(audio -> audio.getProgram() == null)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

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
