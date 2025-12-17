package com.zjsu.yyd.ifmservice.service;


import com.zjsu.yyd.ifmservice.model.AudioDTO;
import com.zjsu.yyd.ifmservice.model.Program;
import com.zjsu.yyd.ifmservice.model.audio.Audio;
import com.zjsu.yyd.ifmservice.repository.AudioRepository;
import com.zjsu.yyd.ifmservice.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 音频业务逻辑层
 */
@Service
public class AudioService {

    @Autowired
    private AudioRepository audioRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private FileService fileService; // 统一处理文件上传（音频/歌词）

    /** 上传音频（可含歌词） */
    public Audio upload(MultipartFile file, MultipartFile lyric, String title, Long programId) throws Exception {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("program not found"));

        String audioPath = fileService.saveFile(file, title);
        String lyricPath = null;
        if (lyric != null) {
            lyricPath = fileService.saveFile(lyric, title);
        }

        Audio audio = new Audio();
        audio.setTitle(title);
        audio.setFilePath(audioPath);
        audio.setLyricPath(lyricPath);
        audio.setProgram(program);

        return audioRepository.save(audio);
    }

    /** 查询某课程下所有音频 */
    public List<AudioDTO> listByProgramDTO(Long programId) {
        return audioRepository.findByProgramProgramId(programId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /** 根据 ID 获取音频 */
    public Audio get(Long id) {
        return audioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("audio not found"));
    }

    /** 转换为 DTO */
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
