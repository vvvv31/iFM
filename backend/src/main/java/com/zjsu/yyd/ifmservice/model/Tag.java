package com.zjsu.yyd.ifmservice.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * 标签实体
 */
@Data
@Entity
@Table(name = "tags")
public class Tag {

    /** 标签 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagId;

    /** 标签名称，唯一 */
    @Column(nullable = false, unique = true)
    private String name;

    // 手动添加getName方法以确保编译通过
    public String getName() {
        return name;
    }
}