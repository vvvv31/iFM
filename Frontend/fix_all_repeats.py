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

# 定义要修复的重复模式
patterns_to_fix = [
    # 模式1：channel.html中的重复
    ('            <div id="auth-section">\n            <div id="auth-section">\n            <a href="login.html"><button class="submit-btn">登录/注册</button></a>\n        </div>\n        </div>\n        </div>',
     '            <div id="auth-section">\n            <a href="login.html"><button class="submit-btn">登录/注册</button></a>\n        </div>'),
    
    # 模式2：其他可能的重复模式
    ('        <div id="auth-section">\n        <div id="auth-section">\n        <a href="login.html"><button class="submit-btn">登录/注册</button></a>\n    </div>\n    </div>\n    </div>',
     '        <div id="auth-section">\n        <a href="login.html"><button class="submit-btn">登录/注册</button></a>\n    </div>')
]

# 遍历所有HTML文件进行修复
for file_path in html_files:
    if os.path.exists(file_path):
        print(f"正在修复文件: {file_path}")
        
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 应用所有修复模式
        modified = False
        for old_pattern, new_pattern in patterns_to_fix:
            if old_pattern in content:
                content = content.replace(old_pattern, new_pattern)
                modified = True
                print(f"  已修复模式: {old_pattern[:30]}...")
        
        # 如果有修改，保存文件
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"已成功修复文件: {file_path}")
        else:
            print(f"  未发现需要修复的重复模式")
    else:
        print(f"文件不存在: {file_path}")

print("所有文件修复完成！")