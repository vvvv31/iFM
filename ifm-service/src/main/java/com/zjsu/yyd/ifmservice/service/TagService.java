package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.Tag;
import com.zjsu.yyd.ifmservice.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 标签业务逻辑层
 */
@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    /** 创建标签 */
    public Tag create(Tag tag) {
        return tagRepository.save(tag);
    }

    /** 查询所有标签 */
    public List<Tag> list() {
        return tagRepository.findAll();
    }

    /** 更新标签 */
    public Tag update(Long id, Tag tag) {
        Tag db = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("tag not found"));
        db.setName(tag.getName());
        return tagRepository.save(db);
    }

    /** 删除标签 */
    public void delete(Long id) {
        tagRepository.deleteById(id);
    }
}
