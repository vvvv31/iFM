# 修复live.html文件中的重复auth-section标签

file_path = "d:/02_Academic/iFM/Frontend/html/live.html"

# 读取文件内容
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 定义重复的模式和正确的模式
repeated_pattern = '''            <div id="auth-section">
            <div id="auth-section">
            <a href="login.html"><button class="submit-btn">登录/注册</button></a>
        </div>
        </div>
        </div>''' 

correct_pattern = '''            <div id="auth-section">
            <a href="login.html"><button class="submit-btn">登录/注册</button></a>
        </div>''' 

# 替换重复模式
if repeated_pattern in content:
    content = content.replace(repeated_pattern, correct_pattern)
    print("已修复live.html中的重复auth-section标签")
else:
    print("未找到重复的auth-section标签模式")

# 保存修改后的文件
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("修复完成！")