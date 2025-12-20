package com.zjsu.yyd.ifmservice.model;

import lombok.Data;

import java.util.List;

/**
 * 节目传输对象，用于创建 / 更新
 */
@Data
public class ProgramDTO {

    private String title;
    private String introduction;
    private String faq;
    private String coverUrl;
    private Long creatorId;
    private List<Long> tagIds;

    // 手动添加getter方法以确保编译通过
    public String getTitle() {
        return title;
    }

    public String getIntroduction() {
        return introduction;
    }

    public String getFaq() {
        return faq;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public List<Long> getTagIds() {
        return tagIds;
    }
}