package com.zjsu.yyd.ifmservice.model.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

/**
 * 用户扩展信息实体（UserProfile）
 *
 * 说明：
 * 1. 与 User 实体是一对一关系
 * 2. 与 User 共享主键（user_id）
 * 3. 用于存放用户的统计类、扩展类信息，避免 User 表过于臃肿
 */
@Data
@Entity
@Table(name = "user_profile")
public class UserProfile {

    /**
     * 主键：用户 ID
     *
     * 说明：
     * - 该字段既是 user_profile 表的主键
     * - 同时也是外键，关联 user 表的主键 id
     */
    @Id
    private Long userId;

    /**
     * 用户基本信息（一对一关联）
     *
     * 说明：
     * - @OneToOne：与 User 是一对一关系
     * - @MapsId：表示当前实体与 User 共享同一个主键
     * - @JoinColumn(name = "user_id")：指定外键列名
     * - @JsonBackReference：防止 JSON 序列化时出现循环引用
     */
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    /**
     * 用户累计收听时长（单位：秒或分钟，按业务约定）
     */
    private Long totalListenTime = 0L;

    /**
     * 粉丝数量
     */
    private Integer fansCount = 0;

    /**
     * 关注数量
     */
    private Integer followCount = 0;

    /**
     * 用户订阅的创作者 ID 列表
     *
     * 说明：
     * - @ElementCollection：表示基本类型集合
     * - JPA 会自动生成一张中间表进行存储
     */
    @ElementCollection
    private List<Long> subscribeCreatorIds;

    /**
     * 用户收藏的音频 ID 列表
     *
     * 说明：
     * - 使用 ElementCollection 存储基础类型集合
     * - 适用于收藏数量不大、无需单独建实体的场景
     */
    @ElementCollection
    private List<Long> collectAudioIds;

}
