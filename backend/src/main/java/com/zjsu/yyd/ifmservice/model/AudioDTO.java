package com.zjsu.yyd.ifmservice.model;

import lombok.Data;

@Data
public class AudioDTO {
    private Long audioId;
    private String title;
    private String filePath;
    private String lyricPath;
    private Long programId;    // 关联课程 ID
    private String programTitle; // 关联课程名称

    // 手动添加setter方法以确保编译通过
    public void setAudioId(Long audioId) {
        this.audioId = audioId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public void setLyricPath(String lyricPath) {
        this.lyricPath = lyricPath;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public void setProgramTitle(String programTitle) {
        this.programTitle = programTitle;
    }
}