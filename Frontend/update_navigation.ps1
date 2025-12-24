# 定义要修改的HTML文件列表
$htmlFiles = @(
    "d:/02_Academic/iFM/Frontend/html/live-streaming.html",
    "d:/02_Academic/iFM/Frontend/html/my-collect.html",
    "d:/02_Academic/iFM/Frontend/html/category.html",
    "d:/02_Academic/iFM/Frontend/html/app.html",
    "d:/02_Academic/iFM/Frontend/html/my-creator_center.html",
    "d:/02_Academic/iFM/Frontend/html/channel.html",
    "d:/02_Academic/iFM/Frontend/html/live.html",
    "d:/02_Academic/iFM/Frontend/html/Audio-Related.html",
    "d:/02_Academic/iFM/Frontend/html/program_list.html",
    "d:/02_Academic/iFM/Frontend/html/my-works.html",
    "d:/02_Academic/iFM/Frontend/html/my-recent.html",
    "d:/02_Academic/iFM/Frontend/html/group-management.html",
    "d:/02_Academic/iFM/Frontend/html/upload-audio.html",
    "d:/02_Academic/iFM/Frontend/html/my-message.html",
    "d:/02_Academic/iFM/Frontend/html/data-analysis.html",
    "d:/02_Academic/iFM/Frontend/html/channel2.html"
)

# 登录状态检查脚本
$loginScript = @"
        <!-- 登录状态检查脚本 -->
        <script>
            // 检查用户是否已登录
            function checkLoginStatus() {
                const authToken = localStorage.getItem('authToken');
                const authSection = document.querySelector('.user-functions');
                
                if (authToken) {
                    // 用户已登录，显示用户菜单
                    const loginBtn = authSection.querySelector('a[href="login.html"]');
                    if (loginBtn) {
                        loginBtn.outerHTML = `
                            <div class="user-menu">
                                <button class="submit-btn" onclick="showUserMenu()">个人中心</button>
                                <div class="dropdown-menu" id="user-dropdown" style="display: none;">
                                    <a href="my-profile.html" class="dropdown-item">我的资料</a>
                                    <a href="#" class="dropdown-item" onclick="logout()">退出登录</a>
                                </div>
                            </div>
                        `;
                    }
                    
                    // 更新用户信息区
                    const usernameElement = document.querySelector('.username');
                    if (usernameElement) {
                        usernameElement.textContent = '已登录用户';
                    }
                }
            }
            
            // 显示用户菜单
            function showUserMenu() {
                const dropdown = document.getElementById('user-dropdown');
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            }
            
            // 登出功能
            function logout() {
                localStorage.removeItem('authToken');
                location.reload();
            }
            
            // 页面加载时检查登录状态
            window.addEventListener('DOMContentLoaded', checkLoginStatus);
            
            // 点击其他区域关闭下拉菜单
            document.addEventListener('click', function(event) {
                const dropdown = document.getElementById('user-dropdown');
                const userMenu = document.querySelector('.user-menu');
                
                if (dropdown && userMenu && !userMenu.contains(event.target)) {
                    dropdown.style.display = 'none';
                }
            });
        </script>
"@

# 为下拉菜单添加CSS样式
$dropdownCSS = @"
        <style>
            .user-menu {
                position: relative;
                display: inline-block;
            }
            
            .dropdown-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background-color: white;
                min-width: 150px;
                box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                border-radius: 4px;
                z-index: 1000;
                margin-top: 5px;
            }
            
            .dropdown-item {
                display: block;
                padding: 10px 15px;
                color: #333;
                text-decoration: none;
                font-size: 14px;
            }
            
            .dropdown-item:hover {
                background-color: #f5f5f5;
            }
        </style>
"@

# 遍历所有HTML文件进行修改
foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "正在处理文件: $file"
        
        # 读取文件内容
        $content = Get-Content $file -Raw
        
        # 添加下拉菜单CSS样式到head部分
        if ($content -match '<head>([\s\S]*?)</head>') {
            $headContent = $matches[1]
            $newHeadContent = $headContent + $dropdownCSS
            $content = $content -replace '<head>([\s\S]*?)</head>', "<head>$newHeadContent</head>"
        }
        
        # 添加登录状态检查脚本到body末尾
        if ($content -match '</body>') {
            $content = $content -replace '</body>', "$loginScript</body>"
        }
        
        # 保存修改后的文件
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "已成功更新文件: $file"
    } else {
        Write-Host "文件不存在: $file"
    }
}

Write-Host "所有文件更新完成！"