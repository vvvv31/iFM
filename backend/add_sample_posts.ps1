# 定义要添加的样本帖子数据
$samplePosts = @(
    @{
        "author" = "小明"
        "text" = "刚完成一节发音练习，收获颇丰！今天终于掌握了 th 的发音技巧，感觉自己又进步了一点点~ 🎉 #英语学习#"
        "likes" = 24
        "tags" = @("英语学习")
        "comments" = @(
            @{"author" = "小红"; "text" = "加油！th的发音确实很难，我也练了很久"}
            @{"author" = "英语达人"; "text" = "可以试试把舌头放在牙齿之间，然后轻轻吹气，效果会更好"}
            @{"author" = "发音教练"; "text" = "th有两种发音：清辅音/θ/和浊辅音/ð/，要注意区分哦"}
        )
    },
    @{
        "author" = "小红"
        "text" = "周末组织线上分享会，主题是《如何提升英语听力》，欢迎大家参加！时间：周六晚8点，腾讯会议。 #英语学习#"
        "likes" = 42
        "tags" = @("英语学习")
        "comments" = @(
            @{"author" = "学霸小姐"; "text" = "已报名！期待周六的分享"}
            @{"author" = "小华"; "text" = "会议号是多少？"}
            @{"author" = "早起鸟"; "text" = "太棒了，正好需要提升听力！已加日历提醒"}
            @{"author" = "英语达人"; "text" = "听力提升最重要的是精听+泛听结合"}
        )
    },
    @{
        "author" = "英语达人"
        "text" = "今日单词打卡 Day 45 ✅\n\ntranscend - 超越，胜过\nperseverance - 坚持不懈\nresilience - 韧性，恢复力\n\n每天积累，必有所成！加油加油 💪 #打卡挑战# #每日一句#"
        "likes" = 89
        "tags" = @("打卡挑战", "每日一句")
        "comments" = @(
            @{"author" = "小明"; "text" = "跟着打卡！perseverance 这个词很棒，我要用到作文里"}
            @{"author" = "商务精英"; "text" = "resilience 在商务场景里经常用到！比如 organizational resilience"}
            @{"author" = "单词狂人"; "text" = "Day 45！太厉害了，我才坚持到Day 7就放弃了😭"}
            @{"author" = "学霸小姐"; "text" = "这三个词都是托福高频词！收藏了"}
        )
    },
    @{
        "author" = "小华"
        "text" = "分享一个学习英语的小技巧：看美剧的时候先关字幕看一遍，然后开英文字幕再看一遍，最后开中文字幕核对。这样可以大大提升听力！ #英语学习#"
        "likes" = 156
        "tags" = @("英语学习")
        "comments" = @(
            @{"author" = "小红"; "text" = "这个方法太实用了！收藏了📌"}
            @{"author" = "英语达人"; "text" = "推荐看《Friends》，对话简单又地道，而且很搞笑"}
            @{"author" = "新手小白"; "text" = "请问一集要看三遍吗？感觉好花时间"}
            @{"author" = "听力弱鸡"; "text" = "关字幕完全听不懂怎么办😢"}
        )
    }
)

# 默认用户ID
$defaultUserId = 1

Write-Host "开始添加样本帖子数据..."

# 循环添加每个帖子
$postCount = 0
foreach ($postData in $samplePosts) {
    $postCount++
    
    # 转换评论数据格式
    $convertedComments = @()
    foreach ($comment in $postData.comments) {
        $convertedComments += @{"author" = $comment.author; "text" = $comment.text}
    }
    
    # 创建要发送的帖子数据
    $post = @{
        "userId" = $defaultUserId
        "author" = $postData.author
        "text" = $postData.text
        "likes" = $postData.likes
        "tags" = $postData.tags
        "comments" = $convertedComments
    }
    
    # 转换为JSON格式
    $postJson = $post | ConvertTo-Json
    
    Write-Host "正在添加第 $postCount 个帖子：$($postData.author)"
    
    try {
        # 发送POST请求添加帖子
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/posts" -Method Post -Body $postJson -ContentType "application/json" -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ 成功添加帖子：$($postData.author)"
        } else {
            Write-Host "❌ 添加帖子失败：$($postData.author)，状态码：$($response.StatusCode)"
        }
    } catch {
        Write-Host "❌ 添加帖子出错：$($postData.author)，错误信息：$_"
    }
}

Write-Host "\n样本帖子数据添加完成！"

# 验证添加结果
Write-Host "\n验证添加结果："
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/posts" -Method Get -UseBasicParsing
$json = ConvertFrom-Json $response.Content
Write-Host "当前数据库中动态数量：$($json.data.Count)"

if ($json.data.Count -eq $samplePosts.Count) {
    Write-Host "✅ 所有样本帖子都已成功添加"
} else {
    Write-Host "❌ 添加结果不符合预期，预期添加 $($samplePosts.Count) 个帖子，实际添加 $($json.data.Count) 个帖子"
}