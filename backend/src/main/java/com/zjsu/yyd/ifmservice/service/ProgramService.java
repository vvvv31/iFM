package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.program.Program;
import com.zjsu.yyd.ifmservice.model.program.ProgramDTO;
import com.zjsu.yyd.ifmservice.repository.ProgramRepository;
import com.zjsu.yyd.ifmservice.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 节目业务逻辑层
 */
@Service
public class ProgramService {

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private TagRepository tagRepository;

    /** 创建节目 */
    public Program create(ProgramDTO dto) {
        Program p = new Program();
        p.setTitle(dto.getTitle());
        p.setIntroduction(dto.getIntroduction());
        p.setFaq(dto.getFaq());
        p.setCoverUrl(dto.getCoverUrl());
        p.setCreatorId(dto.getCreatorId());
        p.setTags(tagRepository.findAllById(dto.getTagIds()));
        return programRepository.save(p);
    }

    /** 查询所有节目 */
    public List<Program> list() {
        return programRepository.findAll();
    }

    /** 根据 ID 获取节目 */
    public Program get(Long id) {
        return programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("program not found"));
    }

    /** 更新节目 */
    public Program update(Long id, ProgramDTO dto) {
        Program p = get(id);
        p.setTitle(dto.getTitle());
        p.setIntroduction(dto.getIntroduction());
        p.setFaq(dto.getFaq());
        p.setCoverUrl(dto.getCoverUrl());
        p.setTags(tagRepository.findAllById(dto.getTagIds()));
        return programRepository.save(p);
    }

    /** 删除节目 */
    public void delete(Long id) {
        programRepository.deleteById(id);
    }


    /** 根据创建者 ID 查询节目 */
    public List<Program> listByCreatorId(Long creatorId) {
        return programRepository.findByCreatorId(creatorId);
    }

}