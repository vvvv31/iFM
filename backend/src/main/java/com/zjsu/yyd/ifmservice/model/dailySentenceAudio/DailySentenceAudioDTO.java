package com.zjsu.yyd.ifmservice.model.dailySentenceAudio;

/**
 * 每日一句音频 DTO
 */
public class DailySentenceAudioDTO {

    private Long dailySentenceId;
    private Long userId;
    private String audioUrl;

    private Double accuracyScore;
    private Double standardScore;
    private Double fluencyScore;

    private String advice;

    public Long getDailySentenceId() {
        return dailySentenceId;
    }

    public void setDailySentenceId(Long dailySentenceId) {
        this.dailySentenceId = dailySentenceId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public Double getAccuracyScore() {
        return accuracyScore;
    }

    public void setAccuracyScore(Double accuracyScore) {
        this.accuracyScore = accuracyScore;
    }

    public Double getStandardScore() {
        return standardScore;
    }

    public void setStandardScore(Double standardScore) {
        this.standardScore = standardScore;
    }

    public Double getFluencyScore() {
        return fluencyScore;
    }

    public void setFluencyScore(Double fluencyScore) {
        this.fluencyScore = fluencyScore;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }
}
