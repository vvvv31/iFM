package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.chat.ChatGroup;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupMember;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupResource;
import com.zjsu.yyd.ifmservice.repository.ChatGroupMemberRepository;
import com.zjsu.yyd.ifmservice.repository.ChatGroupRepository;
import com.zjsu.yyd.ifmservice.repository.ChatGroupResourceRepository;
import com.zjsu.yyd.ifmservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatGroupService {

    private final ChatGroupRepository groupRepo;
    private final ChatGroupMemberRepository memberRepo;
    private final ChatGroupResourceRepository resourceRepo;
    private final UserRepository userRepository;

    public ChatGroupService(ChatGroupRepository groupRepo,
                            ChatGroupMemberRepository memberRepo,
                            ChatGroupResourceRepository resourceRepo,
                            UserRepository userRepository) {
        this.groupRepo = groupRepo;
        this.memberRepo = memberRepo;
        this.resourceRepo = resourceRepo;
        this.userRepository = userRepository;
    }

    /**
     * 创建群聊
     */
    @Transactional
    public ChatGroup createGroup(String name, String desc, Long ownerId, String inviteCode) {
        ChatGroup g = new ChatGroup();
        g.setGroupName(name);
        g.setDescription(desc);
        g.setOwnerId(ownerId);
        g.setMemberCount(1);

        if (inviteCode == null || inviteCode.trim().isEmpty()) {
            g.setInviteCode(generateUniqueInviteCode());
        } else {
            if (groupRepo.findByInviteCode(inviteCode).isPresent()) {
                throw new RuntimeException("邀请码已存在，请换一个");
            }
            g.setInviteCode(inviteCode);
        }

        ChatGroup saved = groupRepo.save(g);

        ChatGroupMember owner = new ChatGroupMember();
        owner.setGroupId(saved.getGroupId());
        owner.setUserId(ownerId);
        owner.setRole(2);
        memberRepo.save(owner);

        return saved;
    }

    private String generateUniqueInviteCode() {
        String code;
        do {
            code = "#" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        } while (groupRepo.findByInviteCode(code).isPresent());
        return code;
    }

    public List<ChatGroupMember> myGroups(Long userId) {
        return memberRepo.findByUserId(userId);
    }

    public ChatGroup getGroup(Long groupId) {
        return groupRepo.findById(groupId)
                .orElseThrow(() -> new RuntimeException("群组不存在"));
    }

    @Transactional
    public void deleteGroup(Long groupId, Long userId) {
        ChatGroup g = getGroup(groupId);
        if (!g.getOwnerId().equals(userId)) {
            throw new RuntimeException("只有群主可以删除群");
        }
        memberRepo.deleteByGroupId(groupId);
        groupRepo.deleteById(groupId);
    }

    @Transactional
    public void joinByInviteCode(String code, Long userId) {
        ChatGroup g = groupRepo.findByInviteCode(code)
                .orElseThrow(() -> new RuntimeException("邀请码无效"));

        if (memberRepo.existsByGroupIdAndUserId(g.getGroupId(), userId)) {
            return;
        }

        ChatGroupMember m = new ChatGroupMember();
        m.setGroupId(g.getGroupId());
        m.setUserId(userId);
        m.setRole(0);
        memberRepo.save(m);

        g.setMemberCount(g.getMemberCount() + 1);
        groupRepo.save(g);
    }

    // 修改返回类型为 List<Map<String, Object>>，包含用户名
    public List<Map<String, Object>> getMembersByGroupId(Long groupId) {
        getGroup(groupId);
        List<ChatGroupMember> members = memberRepo.findByGroupId(groupId);

        return members.stream().map(member -> {
            Map<String, Object> memberMap = new HashMap<>();
            memberMap.put("userId", member.getUserId());
            memberMap.put("role", member.getRole());
            memberMap.put("joinedAt", member.getJoinTime()); // 修改：使用 joinTime 而不是 joinedAt

            // 从 User 表查询用户名
            userRepository.findById(member.getUserId()).ifPresent(user -> {
                memberMap.put("username", user.getUsername());
            });

            return memberMap;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ChatGroupResource addResourceToGroup(Long groupId, Long programId) {
        getGroup(groupId);

        if (resourceRepo.existsByGroupIdAndProgramId(groupId, programId)) {
            throw new RuntimeException("该资源已关联到群组");
        }

        ChatGroupResource resource = new ChatGroupResource();
        resource.setGroupId(groupId);
        resource.setProgramId(programId);
        return resourceRepo.save(resource);
    }

    @Transactional
    public void removeResourceFromGroup(Long groupId, Long programId) {
        ChatGroupResource resource = resourceRepo.findByGroupIdAndProgramId(groupId, programId)
                .orElseThrow(() -> new RuntimeException("资源未找到或未关联该群组"));
        resourceRepo.delete(resource);
    }

    public List<ChatGroupResource> getResourcesByGroupId(Long groupId) {
        getGroup(groupId);
        return resourceRepo.findByGroupId(groupId);
    }

    public List<ChatGroup> getAllGroups() {
        List<ChatGroup> groups = groupRepo.findAll();

        groups.forEach(group -> {
            long actualCount = memberRepo.countByGroupId(group.getGroupId());
            if (group.getMemberCount() != actualCount) {
                group.setMemberCount((int) actualCount);
                groupRepo.save(group);
            }
        });

        return groups;
    }

    public List<ChatGroup> getUserJoinedGroups(Long userId) {
        List<Long> groupIds = memberRepo.findGroupIdsByUserId(userId);
        List<ChatGroup> groups = groupRepo.findAllById(groupIds);

        groups.forEach(group -> {
            long actualCount = memberRepo.countByGroupId(group.getGroupId());
            if (group.getMemberCount() != actualCount) {
                group.setMemberCount((int) actualCount);
                groupRepo.save(group);
            }
        });

        return groups;
    }

    @Transactional
    public void leaveGroup(Long groupId, Long userId) {
        ChatGroup group = groupRepo.findById(groupId)
                .orElseThrow(() -> new RuntimeException("群组不存在"));

        if (group.getOwnerId().equals(userId)) {
            throw new RuntimeException("群主不能退出群组，只能解散群组");
        }

        memberRepo.deleteByGroupIdAndUserId(groupId, userId);

        group.setMemberCount(Math.max(1, group.getMemberCount() - 1));
        groupRepo.save(group);
    }
}