package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.live.LiveRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LiveRoomRepository extends JpaRepository<LiveRoom, Long> {
    List<LiveRoom> findByHostUserId(Long userId);
}
