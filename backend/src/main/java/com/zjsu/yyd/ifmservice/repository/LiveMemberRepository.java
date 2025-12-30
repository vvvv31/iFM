package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.live.LiveMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface LiveMemberRepository extends JpaRepository<LiveMember, Long> {
    long countByLiveIdAndLeaveTimeIsNull(Long liveId);

    List<LiveMember> findByUserId(Long userId);
    List<LiveMember> findByLiveId(Long liveId);
}
