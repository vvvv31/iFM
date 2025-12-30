package com.zjsu.yyd.ifmservice.model.live;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "live_chat")
public class LiveChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatId;

    private Long liveId;

    private Long userId;

    private String content;

    /**
     * 0 普通消息
     * 1 系统消息
     */
    private Integer messageType = 0;

    @CreationTimestamp
    private LocalDateTime sendTime;

    // getter / setter
    public Long getChatId() { return chatId; }

    public Long getLiveId() { return liveId; }
    public void setLiveId(Long liveId) { this.liveId = liveId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getMessageType() { return messageType; }
    public void setMessageType(Integer messageType) { this.messageType = messageType; }

    public LocalDateTime getSendTime() { return sendTime; }
}
