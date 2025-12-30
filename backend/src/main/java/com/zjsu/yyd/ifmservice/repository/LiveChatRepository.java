package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.live.LiveChat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LiveChatRepository extends JpaRepository<LiveChat, Long> {
    List<LiveChat> findByLiveIdOrderBySendTimeAsc(Long liveId);


}
