package com.zjsu.yyd.ifmservice.model.user;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDateTime;

@Entity
@Table(name = "user_history")
@Data
public class UserHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long audioId;

    private LocalDateTime listenedAt;
}
