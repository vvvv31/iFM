package com.zjsu.yyd.ifmservice.util;

import java.io.File;
import java.io.IOException;

public class AudioConverter {

    /**
     * 将音频文件转换为 16kHz 单声道 PCM16 WAV
     *
     * @param inputPath  原始音频文件路径
     * @param outputPath 输出 WAV 文件路径
     * @throws IOException          ffmpeg 执行异常
     * @throws InterruptedException ffmpeg 进程中断
     */
    public static void convertTo16kMonoPCM(String inputPath, String outputPath)
            throws IOException, InterruptedException {

        File inputFile = new File(inputPath);
        if (!inputFile.exists()) {
            throw new IllegalArgumentException("输入文件不存在: " + inputPath);
        }

        // 构建 ffmpeg 命令
        String[] command = {
                "ffmpeg",
                "-y",                  // 覆盖输出文件
                "-i", inputPath,       // 输入文件
                "-ar", "16000",        // 采样率 16kHz
                "-ac", "1",            // 单声道
                "-sample_fmt", "s16",  // PCM16
                outputPath             // 输出文件
        };

        // 执行命令
        Process process = new ProcessBuilder(command)
                .redirectErrorStream(true)
                .start();

        // 等待 ffmpeg 完成
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("音频转换失败，ffmpeg 退出码: " + exitCode);
        }
    }

    public static void main(String[] args) {
        try {
            String input = "C:\\Users\\16754\\OneDrive\\Desktop\\test1.wav";
            String output = "C:\\Users\\16754\\OneDrive\\Desktop\\test1_16k.wav";
            convertTo16kMonoPCM(input, output);
            System.out.println("音频转换完成: " + output);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
