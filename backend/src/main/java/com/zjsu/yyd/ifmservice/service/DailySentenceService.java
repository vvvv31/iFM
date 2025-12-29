package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.dailySentence.DailySentence;
import com.zjsu.yyd.ifmservice.model.dailySentence.DailySentenceDTO;
import com.zjsu.yyd.ifmservice.repository.DailySentenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 每日一句业务逻辑层
 */
@Service
public class DailySentenceService {

    @Autowired
    private DailySentenceRepository dailySentenceRepository;

    /** 创建每日一句 */
    public DailySentence create(DailySentenceDTO dto) {
        DailySentence d = new DailySentence();
        d.setEnglish(dto.getEnglish());
        d.setChinese(dto.getChinese());
        d.setAuthor(dto.getAuthor());
        return dailySentenceRepository.save(d);
    }

    /** 查询全部 */
    public List<DailySentence> list() {
        return dailySentenceRepository.findAll();
    }

    /** 根据 ID 查询 */
    public DailySentence get(Long id) {
        return dailySentenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("daily sentence not found"));
    }

    /** 更新 */
    public DailySentence update(Long id, DailySentenceDTO dto) {
        DailySentence d = get(id);
        d.setEnglish(dto.getEnglish());
        d.setChinese(dto.getChinese());
        d.setAuthor(dto.getAuthor());
        return dailySentenceRepository.save(d);
    }

    /** 删除 */
    public void delete(Long id) {
        dailySentenceRepository.deleteById(id);
    }
}
