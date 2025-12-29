package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.dailySentenceAudio.DailySentenceAudio;
import com.zjsu.yyd.ifmservice.model.dailySentenceAudio.DailySentenceAudioDTO;
import com.zjsu.yyd.ifmservice.repository.DailySentenceAudioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Random;

@Service
public class DailySentenceAudioService {

    @Autowired
    private DailySentenceAudioRepository dailySentenceAudioRepository;

    @Autowired
    private DailySentenceService dailySentenceService;

    @Autowired
    private SpeechEvaluateService speechEvaluateService;

    @Value("${audio.upload-path}")
    private String uploadPath;

    /** 创建学生朗读音频记录 */
//    public DailySentenceAudio create(DailySentenceAudioDTO dto) {
//        DailySentenceAudio audio = new DailySentenceAudio();
//        audio.setDailySentenceId(dto.getDailySentenceId());
//        audio.setUserId(dto.getUserId());
//        audio.setAudioUrl(dto.getAudioUrl());
//        audio.setAccuracyScore(dto.getAccuracyScore());
//        audio.setStandardScore(dto.getStandardScore());
//        audio.setFluencyScore(dto.getFluencyScore());
//        audio.setAdvice(dto.getAdvice());
//        audio.calculateTotalScore();
//        return dailySentenceAudioRepository.save(audio);
//    }

    public DailySentenceAudio create(MultipartFile audioFile,
                                     Long dailySentenceId,
                                     Long userId) {

        if (audioFile.isEmpty()) {
            throw new RuntimeException("上传的音频文件为空");
        }

        try {
            // 1. 创建目录：uploads/dailySentence
            String dirPath = uploadPath + File.separator + "dailySentence";
            File dir = new File(dirPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 2. 生成唯一文件名
            String originalFilename = audioFile.getOriginalFilename();
            String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = System.currentTimeMillis() + "_" + userId + suffix;

            // 3. 保存文件
            File targetFile = new File(dir, fileName);
            audioFile.transferTo(targetFile);

            // 4. 构造 audioUrl（存本地路径）
            String audioUrl = targetFile.getAbsolutePath();

            // 5. 保存数据库记录（不评分）
            DailySentenceAudio audio = new DailySentenceAudio();
            audio.setDailySentenceId(dailySentenceId);
            audio.setUserId(userId);
            audio.setAudioUrl(audioUrl);

            // 初始评分为 0
            audio.setAccuracyScore(0.0);
            audio.setFluencyScore(0.0);
            audio.setStandardScore(0.0);
            audio.setTotalScore(0.0);

            return dailySentenceAudioRepository.save(audio);

        } catch (Exception e) {
            throw new RuntimeException("音频上传失败", e);
        }
    }


    /** 查询全部 */
    public List<DailySentenceAudio> list() {
        return dailySentenceAudioRepository.findAll();
    }

    /** 根据 ID 查询 */
    public DailySentenceAudio get(Long id) {
        return dailySentenceAudioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("daily sentence audio not found"));
    }

    /** 更新 */
    public DailySentenceAudio update(Long id, DailySentenceAudioDTO dto) {
        DailySentenceAudio audio = get(id);
        audio.setDailySentenceId(dto.getDailySentenceId());
        audio.setUserId(dto.getUserId());
        audio.setAudioUrl(dto.getAudioUrl());
        audio.setAccuracyScore(dto.getAccuracyScore());
        audio.setStandardScore(dto.getStandardScore());
        audio.setFluencyScore(dto.getFluencyScore());
        audio.setAdvice(dto.getAdvice());
        audio.calculateTotalScore();
        return dailySentenceAudioRepository.save(audio);
    }

    /** 删除 */
    public void delete(Long id) {
        dailySentenceAudioRepository.deleteById(id);
    }

    /** 根据每日一句 ID 查询所有学生音频 */
    public List<DailySentenceAudio> listByDailySentenceId(Long dailySentenceId) {
        return dailySentenceAudioRepository.findByDailySentenceId(dailySentenceId);
    }

    /** 根据用户 ID 查询 */
    public List<DailySentenceAudio> listByUserId(Long userId) {
        return dailySentenceAudioRepository.findByUserId(userId);
    }

    /** 自动评分（流式音评测版） */
    /** 自动评分（流式音评测版） */
//    public SpeechScoreResult evaluate(Long audioId) {
//        try {
//            // 1. 获取音频记录
//            DailySentenceAudio audio = this.get(audioId);
//
//            // 2. 获取每日一句文本
//            String text = dailySentenceService.getTextById(audio.getDailySentenceId());
//            if (text == null || text.isEmpty()) {
//                throw new RuntimeException("未找到每日一句文本");
//            }
//
//            // 3. 获取音频文件
//            File audioFile = new File(audio.getAudioUrl());
//            if (!audioFile.exists()) {
//                throw new RuntimeException("音频文件不存在：" + audio.getAudioUrl());
//            }
//
//            // 4. 调用讯飞音评测流式 API 评分
//            SpeechScoreResult result = speechEvaluateService.evaluateStream(audioFile, text);
//
//            // 5. 保存评分结果到音频记录
//            audio.setAccuracyScore(result.getAccuracyScore());
//            audio.setFluencyScore(result.getFluencyScore());
//            audio.setStandardScore(result.getStandardScore());
//            audio.setTotalScore(result.getTotalScore());
//            updateScores(audio); // 仅更新评分字段
//
//            return result;
//
//        } catch (Exception e) {
//            throw new RuntimeException("音频评分失败: " + e.getMessage(), e);
//        }
//    }

    /**
     * 自动评分（假数据版，用于占位）
     */
    public DailySentenceAudio fakeEvaluate(Long audioId) {
        DailySentenceAudio audio = get(audioId);

        Random random = new Random();

        // 生成中等偏上的伪随机分数
        double accuracyScore = 70 + random.nextDouble() * 20;   // 70 ~ 90
        double fluencyScore = 65 + random.nextDouble() * 20;    // 65 ~ 85
        double standardScore = 60 + random.nextDouble() * 20;   // 60 ~ 80

        // 保留一位小数，看起来更真实
        accuracyScore = Math.round(accuracyScore * 10.0) / 10.0;
        fluencyScore = Math.round(fluencyScore * 10.0) / 10.0;
        standardScore = Math.round(standardScore * 10.0) / 10.0;

        audio.setAccuracyScore(accuracyScore);
        audio.setFluencyScore(fluencyScore);
        audio.setStandardScore(standardScore);

        // 使用你已有的总分计算逻辑
        audio.calculateTotalScore();

        return dailySentenceAudioRepository.save(audio);
    }



}
