package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.dailySentenceAudio.DailySentenceAudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 每日一句音频仓库
 */
@Repository
public interface DailySentenceAudioRepository extends JpaRepository<DailySentenceAudio, Long> {

    /** 查询某个每日一句下的所有音频 */
    List<DailySentenceAudio> findByDailySentenceId(Long dailySentenceId);

    /** 查询某个用户的所有音频 */
    List<DailySentenceAudio> findByUserId(Long userId);
}
