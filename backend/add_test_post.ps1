# Test script to add a post without Chinese characters
Write-Host "Testing post addition..."

# Create test post data
$testPost = @{
    userId = 1
    author = "TestUser"
    text = "This is a test post. #test #post"
    likes = 5
    tags = @("test", "post")
    comments = @(
        @{author = "Commenter1"; text = "Great post!"}
        @{author = "Commenter2"; text = "Interesting."}
    )
}

# Convert to JSON
$testPostJson = $testPost | ConvertTo-Json

# Send POST request
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/posts" -Method Post -Body $testPostJson -ContentType "application/json" -UseBasicParsing
    Write-Host "Status code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $_"
}

# Verify
Write-Host "\nVerification:"
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/posts" -Method Get -UseBasicParsing
$json = ConvertFrom-Json $response.Content
Write-Host "Total posts: $($json.data.Count)"
