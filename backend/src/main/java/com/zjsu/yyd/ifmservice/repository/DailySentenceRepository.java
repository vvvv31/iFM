package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.dailySentence.DailySentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 每日一句仓库
 */
@Repository
public interface DailySentenceRepository extends JpaRepository<DailySentence, Long> {
}
