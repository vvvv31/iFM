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
}
