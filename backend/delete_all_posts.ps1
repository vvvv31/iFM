# 获取所有动态数据
$response = Invoke-WebRequest -Uri 'http://localhost:8080/api/posts' -Method Get -UseBasicParsing
$json = ConvertFrom-Json $response.Content
$posts = $json.data

# 检查是否有动态数据
if ($posts -and $posts.Count -gt 0) {
    Write-Host "找到 $($posts.Count) 条动态数据，准备删除..."
    
    # 循环删除每个动态
    foreach ($post in $posts) {
        Write-Host "正在删除动态 ID: $($post.id)..."
        try {
            $deleteResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/posts/$($post.id)" -Method Delete -UseBasicParsing
            Write-Host "成功删除动态 ID: $($post.id)"
        } catch {
            Write-Host "删除动态 ID: $($post.id) 失败: $_"
        }
    }
    
    # 验证删除结果
    $afterResponse = Invoke-WebRequest -Uri 'http://localhost:8080/api/posts' -Method Get -UseBasicParsing
    $afterJson = ConvertFrom-Json $afterResponse.Content
    $afterPosts = $afterJson.data
    Write-Host "删除完成！剩余动态数量: $($afterPosts.Count)"
} else {
    Write-Host "没有找到动态数据，无需删除。"
}