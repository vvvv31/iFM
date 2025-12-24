package com.zjsu.yyd.ifmservice.service;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.zjsu.yyd.ifmservice.model.SpeechScoreResult;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@Service
public class SpeechEvaluateService {

    private static final String API_HOST = "ise-api.xfyun.cn";
    private static final String API_PATH = "/v2/open-ise";
    private static final String APPID = "d751c534"; // ⚠️ 替换成真实 APPID
    private static final String API_KEY = "1fab78847a2a1a13170e1b8fc595d446";
    private static final String API_SECRET = "YmE1ZThmOTNiNDcwZDgyN2VhM2Q1NmE5";

    private static final int FRAME_SIZE = 1280; // 每帧大小

    /** 评测方法：2 个参数 */
    public SpeechScoreResult evaluate(MultipartFile audioFile, String refText) {
        try {
            String wsUrl = buildAuthorization();

            OkHttpClient client = new OkHttpClient.Builder()
                    .readTimeout(60, TimeUnit.SECONDS)
                    .build();

            SpeechScoreResult result = new SpeechScoreResult();
            CountDownLatch latch = new CountDownLatch(1);

            Request request = new Request.Builder()
                    .url(wsUrl)
                    .build();

            client.newWebSocket(request, new WebSocketListener() {

                @Override
                public void onOpen(WebSocket webSocket, Response response) {
                    System.out.println("[SpeechEvaluate] WebSocket 已连接");

                    new Thread(() -> {
                        try {
                            sendFirstFrame(webSocket, refText);

                            try (InputStream is = audioFile.getInputStream()) {
                                byte[] buffer = new byte[FRAME_SIZE];
                                int len;
                                int frameIndex = 0;

                                while ((len = is.read(buffer)) != -1) {
                                    int aus = (frameIndex == 0) ? 1 : 2; // 首帧=1，中间帧=2
                                    sendAudioFrame(webSocket, aus, 1,
                                            Base64.getEncoder().encodeToString(Arrays.copyOf(buffer, len)));
                                    System.out.println("[SpeechEvaluate] 已发送帧：" + frameIndex);
                                    frameIndex++;
                                    Thread.sleep(40);
                                }

                                sendAudioFrame(webSocket, 4, 2, "");
                                System.out.println("[SpeechEvaluate] 已发送结束帧");
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            latch.countDown();
                        }
                    }).start();
                }

                @Override
                public void onMessage(WebSocket webSocket, String message) {
                    try {
                        // 保存原始 JSON
                        result.setRawJson(message);

                        JSONObject jsonMsg = JSON.parseObject(message);
                        if (jsonMsg.containsKey("data")) {
                            JSONObject data = jsonMsg.getJSONObject("data");
                            if (data != null && data.containsKey("read_sentence")) {
                                JSONObject score = data.getJSONObject("read_sentence");

                                double accuracy = score.getDoubleValue("accuracy_score");
                                double fluency = score.getDoubleValue("fluency_score");
                                double standard = score.getDoubleValue("standard_score");
                                double total = accuracy * 0.6 + fluency * 0.3 + standard * 0.1;

                                result.setAccuracyScore(accuracy);
                                result.setFluencyScore(fluency);
                                result.setStandardScore(standard);
                                result.setTotalScore(total);

                                latch.countDown();
                                webSocket.close(1000, "finished");
                                System.out.println("[SpeechEvaluate] 评分完成，WebSocket 已关闭");
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                    System.err.println("[SpeechEvaluate] WebSocket 错误");
                    t.printStackTrace();
                    latch.countDown();
                }
            });

            latch.await(60, TimeUnit.SECONDS);
            return result;

        } catch (Exception e) {
            throw new RuntimeException("语音评测失败", e);
        }
    }

    private void sendFirstFrame(WebSocket webSocket, String refText) {
        ParamBuilder frame = new ParamBuilder();
        frame.add("common", new ParamBuilder().add("app_id", APPID))
                .add("business", new ParamBuilder()
                        .add("cmd", "ssb")
                        .add("category", "read_sentence")
                        .add("sub", "ise")
                        .add("ent", "cn_vip")
                        .add("auf", "audio/L16;rate=16000")
                        .add("aue", "raw")
                        .add("tte", "utf-8")
                        .add("rstcd", "utf8")
                        .add("text", "\ufeff" + refText))
                .add("data", new ParamBuilder().add("status", 0).add("data", ""));
        webSocket.send(frame.toString());
        System.out.println("[SpeechEvaluate] 已发送首帧业务参数");
    }

    private void sendAudioFrame(WebSocket webSocket, int aus, int status, String data) {
        ParamBuilder frame = new ParamBuilder();
        frame.add("business", new ParamBuilder().add("cmd", "auw").add("aus", aus).add("aue", "raw"))
                .add("data", new ParamBuilder()
                        .add("status", status)
                        .add("data", data)
                        .add("data_type", 1)
                        .add("encoding", "raw"));
        webSocket.send(frame.toString());
    }

    private String buildAuthorization() throws Exception {
        String hostUrl = "https://" + API_HOST + API_PATH;

        SimpleDateFormat format = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("GMT"));
        String date = format.format(new Date());

        String signatureOrigin = "host: " + API_HOST + "\n" +
                "date: " + date + "\n" +
                "GET " + API_PATH + " HTTP/1.1";

        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(API_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(signatureOrigin.getBytes(StandardCharsets.UTF_8));
        String signature = Base64.getEncoder().encodeToString(hash);

        String authorizationOrigin = String.format(
                "api_key=\"%s\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"%s\"",
                API_KEY, signature
        );

        String authorization = Base64.getEncoder().encodeToString(authorizationOrigin.getBytes(StandardCharsets.UTF_8));

        HttpUrl url = HttpUrl.parse(hostUrl).newBuilder()
                .addQueryParameter("authorization", authorization)
                .addQueryParameter("date", date)
                .addQueryParameter("host", API_HOST)
                .build();

        return url.toString().replace("https://", "wss://");
    }

    private static class ParamBuilder {
        private final JSONObject jsonObject = new JSONObject();

        public ParamBuilder add(String key, Object val) {
            if (val instanceof ParamBuilder) {
                jsonObject.put(key, ((ParamBuilder) val).jsonObject);
            } else {
                jsonObject.put(key, val);
            }
            return this;
        }

        @Override
        public String toString() {
            return jsonObject.toJSONString();
        }
    }
}
