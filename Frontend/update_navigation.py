import os

# 定义要修改的HTML文件列表
html_files = [
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
]

# 查找和替换的文本
old_text = '<a href="login.html"><button class="submit-btn">登录/注册</button></a>'
old_text_app = '<a href="login.html" data-page="login.html"><button class="submit-btn">登录/注册</button></a>'

new_text = '''<div id="auth-section">
            <a href="login.html"><button class="submit-btn">登录/注册</button></a>
        </div>'''
new_text_app = '''<div id="auth-section">
            <a href="login.html" data-page="login.html"><button class="submit-btn">登录/注册</button></a>
        </div>'''

# 登录状态检查脚本
login_script = '''

<!-- 登录状态检查脚本 -->
<script>
    // 检查用户是否已登录
    function checkLoginStatus() {
        const authToken = localStorage.getItem('authToken');
        const authSection = document.getElementById('auth-section');
        
        if (authToken) {
            // 用户已登录，显示用户菜单
            authSection.innerHTML = `
                <div class="user-menu">
                    <button class="submit-btn" onclick="showUserMenu()">个人中心</button>
                    <div class="dropdown-menu" id="user-dropdown" style="display: none;">
                        <a href="my-profile.html" class="dropdown-item">我的资料</a>
                        <a href="#" class="dropdown-item" onclick="logout()">退出登录</a>
                    </div>
                </div>
            `;
            
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
''' 

# 遍历所有HTML文件进行修改
for file_path in html_files:
    if os.path.exists(file_path):
        print(f"正在处理文件: {file_path}")
        
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 替换登录/注册按钮
        if old_text_app in content:
            content = content.replace(old_text_app, new_text_app)
            print(f"  已替换特殊格式登录按钮")
        elif old_text in content:
            content = content.replace(old_text, new_text)
            print(f"  已替换普通格式登录按钮")
        else:
            print(f"  未找到要替换的文本")
        
        # 添加登录状态检查脚本到body末尾
        if '</body>' in content:
            content = content.replace('</body>', login_script + '</body>')
        else:
            print(f"  未找到</body>标签")
        
        # 保存修改后的文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"已成功更新文件: {file_path}")
    else:
        print(f"文件不存在: {file_path}")

print("所有文件更新完成！")