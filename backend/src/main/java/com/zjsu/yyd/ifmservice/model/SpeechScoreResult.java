package com.zjsu.yyd.ifmservice.model;

public class SpeechScoreResult {

    private double accuracyScore;
    private double fluencyScore;
    private double standardScore;
    private double totalScore;

    /** 保存原始 JSON 方便调试 */
    private String rawJson;

    public double getAccuracyScore() {
        return accuracyScore;
    }

    public void setAccuracyScore(double accuracyScore) {
        this.accuracyScore = accuracyScore;
    }

    public double getFluencyScore() {
        return fluencyScore;
    }

    public void setFluencyScore(double fluencyScore) {
        this.fluencyScore = fluencyScore;
    }

    public double getStandardScore() {
        return standardScore;
    }

    public void setStandardScore(double standardScore) {
        this.standardScore = standardScore;
    }

    public double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(double totalScore) {
        this.totalScore = totalScore;
    }

    public String getRawJson() {
        return rawJson;
    }

    public void setRawJson(String rawJson) {
        this.rawJson = rawJson;
    }
}
