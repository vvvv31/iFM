package com.zjsu.yyd.ifmservice.service;

import com.zjsu.yyd.ifmservice.model.content.Banner;
import com.zjsu.yyd.ifmservice.model.content.Category;
import com.zjsu.yyd.ifmservice.model.content.Episode;
import com.zjsu.yyd.ifmservice.model.Program;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContentService {

    /**
     * 获取首页轮播图列表
     * @return 轮播图列表
     */
    public List<Banner> getBannerList() {
        // 这里应该从数据库获取数据，暂时返回模拟数据
        List<Banner> bannerList = new ArrayList<>();
        
        Banner banner1 = new Banner();
        banner1.setBannerId(1L);
        banner1.setImageUrl("https://example.com/banner1.jpg");
        banner1.setLinkUrl("/program/1");
        banner1.setTitle("热门外语节目推荐");
        bannerList.add(banner1);

        Banner banner2 = new Banner();
        banner2.setBannerId(2L);
        banner2.setImageUrl("https://example.com/banner2.jpg");
        banner2.setLinkUrl("/program/2");
        banner2.setTitle("新上线节目");
        bannerList.add(banner2);

        return bannerList;
    }

    /**
     * 获取分类列表
     * @return 分类列表
     */
    public List<Category> getCategoryList() {
        // 这里应该从数据库获取数据，暂时返回模拟数据
        List<Category> categoryList = new ArrayList<>();
        
        Category category1 = new Category();
        category1.setCategoryId(1L);
        category1.setCategoryName("英语");
        category1.setCategoryDesc("英语学习节目");
        categoryList.add(category1);

        Category category2 = new Category();
        category2.setCategoryId(2L);
        category2.setCategoryName("日语");
        category2.setCategoryDesc("日语学习节目");
        categoryList.add(category2);

        return categoryList;
    }

    /**
     * 获取推荐节目列表
     * @param page 页码
     * @param limit 每页数量
     * @return 推荐节目列表
     */
    public List<Program> getRecommendList(Integer page, Integer limit) {
        // 这里应该从数据库获取数据，暂时返回模拟数据
        List<Program> programList = new ArrayList<>();
        
        for (int i = 0; i < limit; i++) {
            Program program = new Program();
            program.setProgramId((long) (i + 1));
            program.setTitle("推荐节目 " + (i + 1));
            program.setIntroduction("这是一个推荐的外语学习节目");
            program.setCoverUrl("https://example.com/cover" + (i + 1) + ".jpg");
            program.setCreatorId(1L);
            program.setPlayCount(1000L + i * 100L);
            programList.add(program);
        }

        return programList;
    }

    /**
     * 根据分类ID获取节目列表
     * @param categoryId 分类ID
     * @param page 页码
     * @param limit 每页数量
     * @return 节目列表
     */
    public List<Program> getProgramListByCategoryId(Long categoryId, Integer page, Integer limit) {
        // 这里应该从数据库获取数据，暂时返回模拟数据
        List<Program> programList = new ArrayList<>();
        
        for (int i = 0; i < limit; i++) {
            Program program = new Program();
            program.setProgramId((long) (categoryId * 10 + i + 1));
            program.setTitle("分类节目 " + program.getProgramId());
            program.setIntroduction("这是分类ID为" + categoryId + "的节目");
            program.setCoverUrl("https://example.com/cover" + program.getProgramId() + ".jpg");
            program.setCreatorId(1L);
            program.setPlayCount(500L + i * 50L);
            programList.add(program);
        }

        return programList;
    }

    /**
     * 根据节目ID获取节目详情
     * @param programId 节目ID
     * @return 节目详情
     */
    public Program getProgramDetail(Long programId) {
        // 这里应该从数据库获取数据，暂时返回模拟数据
        Program program = new Program();
        program.setProgramId(programId);
        program.setTitle("节目详情 " + programId);
        program.setIntroduction("这是节目ID为" + programId + "的详细信息");
        program.setCoverUrl("https://example.com/cover" + programId + ".jpg");
        program.setCreatorId(1L);
        program.setPlayCount(1000L + programId.intValue() * 100L);
        return program;
    }

    /**
     * 根据节目ID获取节目集数列表
     * @param programId 节目ID
     * @param page 页码
     * @param limit 每页数量
     * @return 集数列表
     */
    public List<Episode> getEpisodeListByProgramId(Long programId, Integer page, Integer limit) {
        // 这里应该从数据库获取数据，暂时返回模拟数据
        List<Episode> episodeList = new ArrayList<>();
        
        for (int i = 0; i < limit; i++) {
            Episode episode = new Episode();
            episode.setEpisodeId((long) (programId * 100 + i + 1));
            episode.setProgramId(programId);
            episode.setTitle("第" + (i + 1) + "集 - 节目" + programId);
            episode.setDescription("这是节目ID为" + programId + "的第" + (i + 1) + "集");
            episode.setAudioUrl("https://example.com/audio" + episode.getEpisodeId() + ".mp3");
            episode.setDuration(1800 + i * 60);
            episode.setListenCount(100 + i * 10);
            episodeList.add(episode);
        }

        return episodeList;
    }

    /**
     * 根据集数ID获取集数详情
     * @param episodeId 集数ID
     * @return 集数详情
     */
    public Episode getEpisodeDetail(Long episodeId) {
        // 这里应该从数据库获取数据，暂时返回模拟数据
        Episode episode = new Episode();
        episode.setEpisodeId(episodeId);
        episode.setProgramId(episodeId / 100);
        episode.setTitle("集数详情 " + episodeId);
        episode.setDescription("这是集数ID为" + episodeId + "的详细信息");
        episode.setAudioUrl("https://example.com/audio" + episodeId + ".mp3");
        episode.setDuration(1800 + episodeId.intValue() % 60);
        episode.setListenCount(100 + episodeId.intValue() % 100);
        return episode;
    }

    /**
     * 根据关键词搜索节目
     * @param keyword 搜索关键词
     * @param page 页码
     * @param limit 每页数量
     * @return 节目列表
     */
    public List<Program> searchProgram(String keyword, Integer page, Integer limit) {
        // 这里应该从数据库获取数据，暂时返回模拟数据
        List<Program> programList = new ArrayList<>();
        
        for (int i = 0; i < limit; i++) {
            Program program = new Program();
            program.setProgramId((long) (1000 + i + 1));
            program.setTitle("搜索结果 " + keyword + " - " + (i + 1));
            program.setIntroduction("这是包含关键词\"" + keyword + "\"的节目");
            program.setCoverUrl("https://example.com/cover" + program.getProgramId() + ".jpg");
            program.setCreatorId(1L);
            program.setPlayCount(500L + i * 50L);
            programList.add(program);
        }

        return programList;
    }
}