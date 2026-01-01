package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.chat.ChatGroup;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupMember;
import com.zjsu.yyd.ifmservice.model.chat.ChatGroupResource;
import com.zjsu.yyd.ifmservice.repository.ChatGroupMemberRepository;
import com.zjsu.yyd.ifmservice.repository.ChatGroupRepository;
import com.zjsu.yyd.ifmservice.repository.ChatGroupResourceRepository;
import org.springframework.stereotype.Service;

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
     * @param name 群名
     * @param desc 描述
     * @param ownerId 群主ID
     * @param inviteCode 可选邀请码，如果为空则自动生成
     */
    public ChatGroup createGroup(String name, String desc, Long ownerId, String inviteCode) {
        ChatGroup g = new ChatGroup();
        g.setGroupName(name);
        g.setDescription(desc);
        g.setOwnerId(ownerId);

        if (inviteCode == null || inviteCode.trim().isEmpty()) {
            g.setInviteCode(generateUniqueInviteCode());
        } else {
            // 前端传入邀请码，先检查唯一性
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
            code = "#" + UUID.randomUUID().toString().replace("-", "").substring(0, 12); // 12位更安全
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

    public void deleteGroup(Long groupId, Long userId) {
        ChatGroup g = getGroup(groupId);
        if (!g.getOwnerId().equals(userId)) {
            throw new RuntimeException("只有群主可以删除群");
        }
        groupRepo.deleteById(groupId);
    }

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
    }
    // ========== 新增功能：群组成员 ==========

    public List<ChatGroupMember> getMembersByGroupId(Long groupId) {
        // 检查群是否存在
        getGroup(groupId);
        return memberRepo.findByGroupId(groupId);
    }

    // ========== 新增功能：群组资源增删查 ==========

    public ChatGroupResource addResourceToGroup(Long groupId, Long programId) {
        // 检查群是否存在
        getGroup(groupId);

        // 避免重复关联
        if (resourceRepo.existsByGroupIdAndProgramId(groupId, programId)) {
            throw new RuntimeException("该资源已关联到群组");
        }

        ChatGroupResource resource = new ChatGroupResource();
        resource.setGroupId(groupId);
        resource.setProgramId(programId);
        return resourceRepo.save(resource);
    }

    public void removeResourceFromGroup(Long groupId, Long programId) {
        ChatGroupResource resource = resourceRepo.findByGroupIdAndProgramId(groupId, programId)
                .orElseThrow(() -> new RuntimeException("资源未找到或未关联该群组"));
        resourceRepo.delete(resource);
    }

    public List<ChatGroupResource> getResourcesByGroupId(Long groupId) {
        getGroup(groupId);
        return resourceRepo.findByGroupId(groupId);
    }
}
