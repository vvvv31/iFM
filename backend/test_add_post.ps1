# 测试添加一个简单的帖子
Write-Host "测试添加帖子..."

# 创建测试帖子数据
$testPost = @{
    "userId" = 1
    "author" = "TestUser"
    "text" = "This is a test post. #test #post"
    "likes" = 5
    "tags" = @("test", "post")
    "comments" = @(
        @{"author" = "Commenter1"; "text" = "Great post!"}
        @{"author" = "Commenter2"; "text" = "Interesting."}
    )
}

# 转换为JSON格式
$testPostJson = $testPost | ConvertTo-Json

# 发送POST请求添加帖子
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/posts" -Method Post -Body $testPostJson -ContentType "application/json" -UseBasicParsing
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 成功添加测试帖子"
    } else {
        Write-Host "❌ 添加测试帖子失败，状态码：$($response.StatusCode)"
    }
} catch {
    Write-Host "❌ 添加测试帖子出错：$_"
}

# 验证结果
Write-Host "\n验证结果："
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/posts" -Method Get -UseBasicParsing
$json = ConvertFrom-Json $response.Content
Write-Host "当前数据库中帖子数量：$($json.data.Count)"
