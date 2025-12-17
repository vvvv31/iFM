package com.zjsu.yyd.ifmservice.model;

import lombok.Data;

import java.util.List;
@Data
/**
 * 节目传输对象，用于创建 / 更新
 */
public class ProgramDTO {

    private String title;
    private String introduction;
    private String faq;
    private String coverUrl;
    private Long creatorId;
    private List<Long> tagIds;

    // getter / setter
}
