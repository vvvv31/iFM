package com.zjsu.yyd.ifmservice.util;

import com.zjsu.yyd.ifmservice.model.Comment;
import com.zjsu.yyd.ifmservice.model.Post;
import com.zjsu.yyd.ifmservice.repository.PostRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 样本数据初始化器，用于添加示例帖子数据到数据库
 */
@Component
public class SampleDataInitializer {

    @Autowired
    private PostRepository postRepository;

    @PostConstruct
    public void initializeSampleData() {
        // 检查是否已有数据，如果有则不添加
        if (postRepository.count() > 0) {
            System.out.println("数据库中已有帖子数据，跳过样本数据初始化");
            return;
        }

        System.out.println("开始添加样本帖子数据...");

        // 创建样本帖子列表
        List<Post> samplePosts = new ArrayList<>();

        // 帖子1：小明的发音练习帖子
        Post post1 = new Post();
        post1.setUserId(1L);
        post1.setAuthor("小明");
        post1.setText("刚完成一节发音练习，收获颇丰！今天终于掌握了 th 的发音技巧，感觉自己又进步了一点点~ 🎉 #英语学习#");
        post1.setLikes(24);
        post1.setTags(Arrays.asList("英语学习"));
        
        List<Comment> comments1 = new ArrayList<>();
        Comment comment1_1 = new Comment();
        comment1_1.setAuthor("小红");
        comment1_1.setText("加油！th的发音确实很难，我也练了很久");
        comments1.add(comment1_1);
        
        Comment comment1_2 = new Comment();
        comment1_2.setAuthor("英语达人");
        comment1_2.setText("可以试试把舌头放在牙齿之间，然后轻轻吹气，效果会更好");
        comments1.add(comment1_2);
        
        Comment comment1_3 = new Comment();
        comment1_3.setAuthor("发音教练");
        comment1_3.setText("th有两种发音：清辅音/θ/和浊辅音/ð/，要注意区分哦");
        comments1.add(comment1_3);
        
        post1.setComments(comments1);
        samplePosts.add(post1);

        // 帖子2：小红的分享会帖子
        Post post2 = new Post();
        post2.setUserId(1L);
        post2.setAuthor("小红");
        post2.setText("周末组织线上分享会，主题是《如何提升英语听力》，欢迎大家参加！时间：周六晚8点，腾讯会议。 #英语学习#");
        post2.setLikes(42);
        post2.setTags(Arrays.asList("英语学习"));
        
        List<Comment> comments2 = new ArrayList<>();
        Comment comment2_1 = new Comment();
        comment2_1.setAuthor("学霸小姐");
        comment2_1.setText("已报名！期待周六的分享");
        comments2.add(comment2_1);
        
        Comment comment2_2 = new Comment();
        comment2_2.setAuthor("小华");
        comment2_2.setText("会议号是多少？");
        comments2.add(comment2_2);
        
        Comment comment2_3 = new Comment();
        comment2_3.setAuthor("早起鸟");
        comment2_3.setText("太棒了，正好需要提升听力！已加日历提醒");
        comments2.add(comment2_3);
        
        Comment comment2_4 = new Comment();
        comment2_4.setAuthor("英语达人");
        comment2_4.setText("听力提升最重要的是精听+泛听结合");
        comments2.add(comment2_4);
        
        post2.setComments(comments2);
        samplePosts.add(post2);

        // 帖子3：英语达人的单词打卡帖子
        Post post3 = new Post();
        post3.setUserId(1L);
        post3.setAuthor("英语达人");
        post3.setText("今日单词打卡 Day 45 ✅\n\ntranscend - 超越，胜过\nperseverance - 坚持不懈\nresilience - 韧性，恢复力\n\n每天积累，必有所成！加油加油 💪 #打卡挑战# #每日一句#");
        post3.setLikes(89);
        post3.setTags(Arrays.asList("打卡挑战", "每日一句"));
        
        List<Comment> comments3 = new ArrayList<>();
        Comment comment3_1 = new Comment();
        comment3_1.setAuthor("小明");
        comment3_1.setText("跟着打卡！perseverance 这个词很棒，我要用到作文里");
        comments3.add(comment3_1);
        
        Comment comment3_2 = new Comment();
        comment3_2.setAuthor("商务精英");
        comment3_2.setText("resilience 在商务场景里经常用到！比如 organizational resilience");
        comments3.add(comment3_2);
        
        Comment comment3_3 = new Comment();
        comment3_3.setAuthor("单词狂人");
        comment3_3.setText("Day 45！太厉害了，我才坚持到Day 7就放弃了😭");
        comments3.add(comment3_3);
        
        Comment comment3_4 = new Comment();
        comment3_4.setAuthor("学霸小姐");
        comment3_4.setText("这三个词都是托福高频词！收藏了");
        comments3.add(comment3_4);
        
        post3.setComments(comments3);
        samplePosts.add(post3);

        // 帖子4：小华的学习技巧帖子
        Post post4 = new Post();
        post4.setUserId(1L);
        post4.setAuthor("小华");
        post4.setText("分享一个学习英语的小技巧：看美剧的时候先关字幕看一遍，然后开英文字幕再看一遍，最后开中文字幕核对。这样可以大大提升听力！ #英语学习#");
        post4.setLikes(156);
        post4.setTags(Arrays.asList("英语学习"));
        
        List<Comment> comments4 = new ArrayList<>();
        Comment comment4_1 = new Comment();
        comment4_1.setAuthor("小红");
        comment4_1.setText("这个方法太实用了！收藏了📌");
        comments4.add(comment4_1);
        
        Comment comment4_2 = new Comment();
        comment4_2.setAuthor("英语达人");
        comment4_2.setText("推荐看《Friends》，对话简单又地道，而且很搞笑");
        comments4.add(comment4_2);
        
        Comment comment4_3 = new Comment();
        comment4_3.setAuthor("新手小白");
        comment4_3.setText("请问一集要看三遍吗？感觉好花时间");
        comments4.add(comment4_3);
        
        Comment comment4_4 = new Comment();
        comment4_4.setAuthor("听力弱鸡");
        comment4_4.setText("关字幕完全听不懂怎么办😢");
        comments4.add(comment4_4);
        
        post4.setComments(comments4);
        samplePosts.add(post4);

        // 保存所有样本帖子到数据库
        postRepository.saveAll(samplePosts);

        System.out.println("样本帖子数据添加完成！共添加了 " + samplePosts.size() + " 个帖子");
    }
}