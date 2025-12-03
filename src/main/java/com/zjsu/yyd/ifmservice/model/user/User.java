package com.zjsu.yyd.ifmservice.model.user;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 用户实体类（User）
 *
 * 对应数据表：users
 * 主要用于存储系统用户的基础信息，包括：
 * - 手机号（登录凭证）
 * - 用户名
 * - 密码（已加密）
 * - 头像
 * - 英语等级（默认 A1）
 * - 创建与更新时间（自动维护）
 *
 * 使用 JPA 注解完成 ORM 映射，配合 Spring Data JPA 自动生成数据库操作。
 */
@Data
@Entity
@Table(name = "users") // 指定对应的数据库表名
public class User {

    /**
     * 用户唯一 ID（主键）
     *
     * GenerationType.IDENTITY：使用数据库自增策略
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    /**
     * 手机号（唯一，必填）。
     * 作为登录凭证。
     */
    @Column(nullable = false, unique = true)
    private String phone;

    /**
     * 用户昵称（可为空）
     */
    private String username;

    /**
     * 用户密码（已加密存储）。
     * 字段名指定为 "password"，数据库中会显示 password。
     */
    @Column(name = "password", nullable = false)
    private String password;

    /**
     * 用户头像 URL（可为空）
     */
    private String avatarUrl;

    /**
     * 用户英语水平等级（A1 ~ C2），默认 A1
     */
    private String level = "A1";

    /**
     * 创建时间（自动填充）
     * @CreationTimestamp 会在插入时自动写入当前时间
     */
    @CreationTimestamp
    private LocalDateTime createdAt;

    /**
     * 更新时间（自动填充）
     * @UpdateTimestamp 会在每次更新时自动写入当前时间
     */
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
