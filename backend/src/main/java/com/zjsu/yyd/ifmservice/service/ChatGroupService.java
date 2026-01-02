package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.chat.ChatGroup;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupMember;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupResource;
import com.zjsu.yyd.ifmservice.repository.ChatGroupMemberRepository;
import com.zjsu.yyd.ifmservice.repository.ChatGroupRepository;
import com.zjsu.yyd.ifmservice.repository.ChatGroupResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChatGroupService {

    private final ChatGroupRepository groupRepo;
    private final ChatGroupMemberRepository memberRepo;
    private final ChatGroupResourceRepository resourceRepo;

    public ChatGroupService(ChatGroupRepository groupRepo,
                            ChatGroupMemberRepository memberRepo,
                            ChatGroupResourceRepository resourceRepo) {
        this.groupRepo = groupRepo;
        this.memberRepo = memberRepo;
        this.resourceRepo = resourceRepo;
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
        g.setMemberCount(1); // 初始化成员数为1（创建者）

        if (inviteCode == null || inviteCode.trim().isEmpty()) {
            g.setInviteCode(generateUniqueInviteCode());
        } else {
            if (groupRepo.findByInviteCode(inviteCode).isPresent()) {
                throw new RuntimeException("邀请码已存在，请换一个");
            }
            g.setInviteCode(inviteCode);
        }

        ChatGroup saved = groupRepo.save(g);

        // 群主默认加入群
        ChatGroupMember owner = new ChatGroupMember();
        owner.setGroupId(saved.getGroupId());
        owner.setUserId(ownerId);
        owner.setRole(2); // 群主
        memberRepo.save(owner);

        return saved;
    }

    /**
     * 生成唯一邀请码
     */
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
        // 删除所有成员
        memberRepo.deleteByGroupId(groupId);
        // 删除群组
        groupRepo.deleteById(groupId);
    }

    @Transactional
    public void joinByInviteCode(String code, Long userId) {
        ChatGroup g = groupRepo.findByInviteCode(code)
                .orElseThrow(() -> new RuntimeException("邀请码无效"));

        if (memberRepo.existsByGroupIdAndUserId(g.getGroupId(), userId)) {
            return; // 已是成员
        }

        ChatGroupMember m = new ChatGroupMember();
        m.setGroupId(g.getGroupId());
        m.setUserId(userId);
        m.setRole(0); // 普通成员
        memberRepo.save(m);

        // 更新成员数
        g.setMemberCount(g.getMemberCount() + 1);
        groupRepo.save(g);
    }

    public List<ChatGroupMember> getMembersByGroupId(Long groupId) {
        getGroup(groupId);
        return memberRepo.findByGroupId(groupId);
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

        // 同步每个群组的实际成员数
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

        // 同步每个群组的实际成员数
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

        // 删除成员关系
        memberRepo.deleteByGroupIdAndUserId(groupId, userId);

        // 更新成员数（确保不小于1，因为至少有群主）
        group.setMemberCount(Math.max(1, group.getMemberCount() - 1));
        groupRepo.save(group);
    }
}