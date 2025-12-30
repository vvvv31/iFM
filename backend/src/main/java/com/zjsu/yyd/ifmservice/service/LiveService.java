package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.live.LiveChat;
import com.zjsu.yyd.ifmservice.model.live.LiveMember;
import com.zjsu.yyd.ifmservice.model.live.LiveRoom;
import com.zjsu.yyd.ifmservice.repository.LiveChatRepository;
import com.zjsu.yyd.ifmservice.repository.LiveMemberRepository;
import com.zjsu.yyd.ifmservice.repository.LiveRoomRepository;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LiveService {

    private final LiveRoomRepository liveRoomRepo;
    private final LiveMemberRepository liveMemberRepo;
    private final LiveChatRepository liveChatRepo;
    private final UserRepository userRepository;

    public LiveService(
            LiveRoomRepository liveRoomRepo,
            LiveMemberRepository liveMemberRepo,
            LiveChatRepository liveChatRepo,
            UserRepository userRepository
    ) {
        this.liveRoomRepo = liveRoomRepo;
        this.liveMemberRepo = liveMemberRepo;
        this.liveChatRepo = liveChatRepo;
        this.userRepository = userRepository;
    }

    /** 创建直播间 */
    public LiveRoom createLive(Long hostUserId, String title, String desc) {
        LiveRoom room = new LiveRoom();
        room.setHostUserId(hostUserId);
        room.setTitle(title);
        room.setDescription(desc);
        return liveRoomRepo.save(room);
    }

    /** 开始直播 */
    public void startLive(Long liveId) {
        LiveRoom room = liveRoomRepo.findById(liveId)
                .orElseThrow(() -> new RuntimeException("直播不存在"));
        room.setStatus(1); // 直播中
        room.setStartTime(LocalDateTime.now());
        liveRoomRepo.save(room);
    }

    /** 结束直播 */
    public void endLive(Long liveId) {
        LiveRoom room = liveRoomRepo.findById(liveId)
                .orElseThrow(() -> new RuntimeException("直播不存在"));
        room.setStatus(2); // 已结束
        room.setEndTime(LocalDateTime.now());
        liveRoomRepo.save(room);
    }

    /** 进入直播间 */
    public void joinLive(Long liveId, Long userId, Integer role) {
        LiveMember member = new LiveMember();
        member.setLiveId(liveId);
        member.setUserId(userId);
        member.setRole(role);
        liveMemberRepo.save(member);
    }

    /** 发送聊天消息 */
    public LiveChat sendChat(Long liveId, Long userId, String content) {
        LiveChat chat = new LiveChat();
        chat.setLiveId(liveId);
        chat.setUserId(userId);
        chat.setContent(content);
        // 不需要手动设置时间，@CreationTimestamp 自动生成
        return liveChatRepo.save(chat);
    }

    // ==================== 查询功能 ====================

    /** 获取所有直播间 */
    public List<LiveRoom> getAllLives() {
        return liveRoomRepo.findAll();
    }

    /** 根据用户ID获取直播间列表（作为主播或参与者） */
    public List<LiveRoom> getLivesByUserId(Long userId) {
        // 主播创建的直播
        List<LiveRoom> hostRooms = liveRoomRepo.findByHostUserId(userId);
        // 参与的直播
        List<Long> joinedLiveIds = liveMemberRepo.findByUserId(userId)
                .stream().map(LiveMember::getLiveId).collect(Collectors.toList());
        List<LiveRoom> joinedRooms = liveRoomRepo.findAllById(joinedLiveIds);
        // 合并去重
        hostRooms.addAll(joinedRooms.stream()
                .filter(r -> hostRooms.stream().noneMatch(hr -> hr.getLiveId().equals(r.getLiveId())))
                .collect(Collectors.toList()));
        return hostRooms;
    }

    /** 根据直播ID获取聊天记录 */
    public List<LiveChat> getChatsByLiveId(Long liveId) {
        return liveChatRepo.findByLiveIdOrderBySendTimeAsc(liveId); // 对应字段 sendTime
    }

    /** 根据直播ID获取所有成员ID */
    public List<Long> getMembersByLiveId(Long liveId) {
        return liveMemberRepo.findByLiveId(liveId)
                .stream().map(LiveMember::getUserId)
                .collect(Collectors.toList());
    }
}
