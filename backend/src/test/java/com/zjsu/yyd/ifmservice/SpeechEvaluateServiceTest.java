package com.zjsu.yyd.ifmservice;

import com.zjsu.yyd.ifmservice.model.SpeechScoreResult;
import com.zjsu.yyd.ifmservice.service.SpeechEvaluateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import java.io.FileInputStream;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SpeechEvaluateServiceTest {

    @Autowired
    private SpeechEvaluateService speechEvaluateService;

    @Test
    void testEvaluateWithLocalAudioFile() {
        // 1. 准备英文文本（必须和音频朗读内容一致）
        String text = "The best way to predict the future is to create it.";

        // 2. 本地音频文件路径（⚠️换成你自己的）
        String audioPath = "C:\\Users\\16754\\OneDrive\\Desktop\\test1_16k.wav";

        // 3. 将本地文件包装成 MultipartFile
        try (InputStream inputStream = new FileInputStream(audioPath)) {

            MockMultipartFile multipartFile = new MockMultipartFile(
                    "audioFile",
                    "read_sentence.wav",
                    "audio/wav",
                    inputStream
            );

            // 4. 调用评测服务
            SpeechScoreResult result = speechEvaluateService.evaluate(multipartFile, text);

            // 5. 输出评分结果和原始 JSON（方便调试）
            System.out.println("====== 语音评测结果 ======");
            System.out.println("准确度分 accuracyScore: " + result.getAccuracyScore());
            System.out.println("流利度分 fluencyScore: " + result.getFluencyScore());
            System.out.println("标准度分 standardScore: " + result.getStandardScore());
            System.out.println("总分 totalScore: " + result.getTotalScore());
            System.out.println("原始 JSON rawJson: " + result.getRawJson());

            // 6. 简单断言（防止返回空）
            assertNotNull(result);
            assertTrue(result.getTotalScore() >= 0);

        } catch (Exception e) {
            e.printStackTrace();
            fail("语音评测异常：" + e.getMessage());
        }
    }
}
