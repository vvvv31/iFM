#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复my-recent.html中的重复登录状态检查脚本并添加游客模式管理功能
"""

def fix_my_recent():
    file_path = 'my-recent.html'
    
    # 读取原文件
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 定义要替换的内容
    second_script_start = '<!-- 登录状态检查脚本 -->\n<script>\n    // 检查用户是否已登录\n    function checkLoginStatus() {\n        const authToken = localStorage.getItem(\'authToken\');\n        const authSection = document.getElementById(\'auth-section\');\n        \n        if (authToken) {\n            // 用户已登录，显示用户菜单\n            authSection.innerHTML = `\n                <div class="user-menu">\n                    <button class="submit-btn" onclick="showUserMenu()">个人中心</button>\n                    <div class="dropdown-menu" id="user-dropdown" style="display: none;">\n                        <a href="my-profile.html" class="dropdown-item">我的资料</a>\n                        <a href="#" class="dropdown-item" onclick="logout()">退出登录</a>\n                    </div>\n                </div>\n            `;\n            \n            // 更新用户信息区\n            const usernameElement = document.querySelector(\'.username\');\n            if (usernameElement) {\n                usernameElement.textContent = \'已登录用户\';\n            }\n        }\n    }\n    \n    // 显示用户菜单\n    function showUserMenu() {\n        const dropdown = document.getElementById(\'user-dropdown\');\n        dropdown.style.display = dropdown.style.display === \'none\' ? \'block\' : \'none\';\n    }\n    \n    // 登出功能\n    function logout() {\n        localStorage.removeItem(\'authToken\');\n        location.reload();\n    }\n    \n    // 页面加载时检查登录状态\n    window.addEventListener(\'DOMContentLoaded\', checkLoginStatus);\n    \n    // 点击其他区域关闭下拉菜单\n    document.addEventListener(\'click\', function(event) {\n        const dropdown = document.getElementById(\'user-dropdown\');\n        const userMenu = document.querySelector(\'.user-menu\');\n        \n        if (dropdown && userMenu && !userMenu.contains(event.target)) {\n            dropdown.style.display = \'none\';\n        }\n    });\n</script>\n\n<style>\n    .user-menu {\n        position: relative;\n        display: inline-block;\n    }\n    \n    .dropdown-menu {\n        position: absolute;\n        top: 100%;\n        right: 0;\n        background-color: white;\n        min-width: 150px;\n        box-shadow: 0 8px 16px rgba(0,0,0,0.1);\n        border-radius: 4px;\n        z-index: 1000;\n        margin-top: 5px;\n    }\n    \n    .dropdown-item {\n        display: block;\n        padding: 10px 15px;\n        color: #333;\n        text-decoration: none;\n        font-size: 14px;\n    }\n    \n    .dropdown-item:hover {\n        background-color: #f5f5f5;\n    }\n</style>'
    
    # 定义新的游客模式管理脚本
    new_guest_script = '''<!-- 游客模式管理和增强登录状态检查 -->
<script>
    // ============ 游客模式管理 ============
    let isGuestMode = false;
    let guestData = {
        username: '游客',
        followingCount: 0,
        fansCount: 0,
        listenHistory: []
    };

    // 检查用户状态并更新UI
    async function checkUserStatus() {
        try {
            const response = await fetch('/api/user/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                const userData = result.data;
                
                if (userData.isGuest) {
                    // 游客模式
                    isGuestMode = true;
                    guestData = {
                        username: '游客',
                        followingCount: userData.followingCount || 0,
                        fansCount: userData.fansCount || 0,
                        listenHistory: userData.listenHistory || []
                    };
                    
                    updateUIForGuestMode();
                    loadGuestHistory();
                } else {
                    // 登录模式
                    isGuestMode = false;
                    updateUIForLoggedMode(userData);
                }
            } else {
                // 接口异常，默认游客模式
                setGuestMode();
            }
        } catch (error) {
            console.log('获取用户状态失败，使用游客模式:', error);
            setGuestMode();
        }
    }

    // 设置为游客模式
    function setGuestMode() {
        isGuestMode = true;
        guestData = {
            username: '游客',
            followingCount: 0,
            fansCount: 0,
            listenHistory: []
        };
        updateUIForGuestMode();
        loadGuestHistory();
    }

    // 更新UI为游客模式
    function updateUIForGuestMode() {
        const usernameEl = document.getElementById('displayUsername');
        const followingEl = document.getElementById('followingCount');
        const fansEl = document.getElementById('fansCount');
        
        if (usernameEl) usernameEl.textContent = '游客';
        if (followingEl) followingEl.textContent = '0';
        if (fansEl) fansEl.textContent = '0';

        // 添加游客提示
        showGuestNotice();
    }

    // 更新UI为登录模式
    function updateUIForLoggedMode(userData) {
        const usernameEl = document.getElementById('displayUsername');
        const followingEl = document.getElementById('followingCount');
        const fansEl = document.getElementById('fansCount');
        
        if (usernameEl) usernameEl.textContent = userData.username || '用户';
        if (followingEl) followingEl.textContent = userData.followingCount || 0;
        if (fansEl) fansEl.textContent = userData.fansCount || 0;

        // 移除游客提示
        hideGuestNotice();
    }

    // 显示游客提示
    function showGuestNotice() {
        const noticeId = 'guest-notice';
        let notice = document.getElementById(noticeId);
        if (!notice) {
            notice = document.createElement('div');
            notice.id = noticeId;
            notice.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #FFF8DC, #FFE5CC);
                    border: 1px solid #FFEDCC;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px 0;
                    text-align: center;
                    box-shadow: 0 2px 8px rgba(255, 140, 0, 0.1);
                ">
                    <i class="fas fa-user-clock" style="color: #FF8C00; font-size: 18px; margin-right: 8px;"></i>
                    <span style="color: #FF8C00; font-weight: 500;">您当前处于游客模式</span>
                    <br>
                    <small style="color: #999; margin-top: 8px; display: block;">
                        登录后可同步您的收听历史和个人数据
                    </small>
                    <button onclick="location.href='login.html'" style="
                        background: #FF8C00;
                        color: white;
                        border: none;
                        padding: 6px 16px;
                        border-radius: 4px;
                        margin-top: 8px;
                        cursor: pointer;
                        font-size: 12px;
                    ">立即登录</button>
                </div>
            `;
            const userInfoSection = document.querySelector('.user-info');
            if (userInfoSection) {
                userInfoSection.parentNode.insertBefore(notice, userInfoSection.nextSibling);
            }
        }
    }

    // 隐藏游客提示
    function hideGuestNotice() {
        const notice = document.getElementById('guest-notice');
        if (notice) {
            notice.remove();
        }
    }

    // 加载游客收听历史
    function loadGuestHistory() {
        // 模拟游客的收听历史数据
        const guestHistory = [
            {
                id: '1',
                title: '日常英语口语600句',
                teacher: '王老师',
                duration: '38:15',
                progress: 75,
                date: '2024-12-21',
                thumbnail: '../images/daily_english.jpg'
            },
            {
                id: '2',
                title: '职场英语沟通技巧',
                teacher: '赵老师',
                duration: '45:10',
                progress: 30,
                date: '2024-12-21',
                thumbnail: '../images/workplace_english.jpg'
            }
        ];

        renderGuestHistory(guestHistory);
    }

    // 渲染游客历史
    function renderGuestHistory(historyData) {
        // 这里可以动态渲染历史数据
        // 暂时使用静态数据，保持页面原有的展示效果
        console.log('游客历史数据:', historyData);
    }

    // 监听认证状态变化
    window.addEventListener('message', function(e) {
        try {
            const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            if (data.type === 'authStatusChanged') {
                // 重新检查用户状态
                setTimeout(checkUserStatus, 500);
            }
        } catch (error) {
            console.error('处理认证状态消息出错:', error);
        }
    });

    // 监听存储变化
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken') {
            setTimeout(checkUserStatus, 500);
        }
    });
</script>'''
    
    # 替换第二个重复的脚本
    if second_script_start in content:
        content = content.replace(second_script_start, new_guest_script)
        print("成功替换重复的登录状态检查脚本并添加游客模式管理功能")
    else:
        print("未找到第二个重复的登录状态检查脚本")
    
    # 写入修改后的内容
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("文件修改完成")

if __name__ == "__main__":
    fix_my_recent()