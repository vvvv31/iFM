package com.zjsu.yyd.ifmservice.repository;

import com.zjsu.yyd.ifmservice.model.user.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}