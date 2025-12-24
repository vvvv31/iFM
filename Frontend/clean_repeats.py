import os
import re

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

# 清理重复的auth-section div的正则表达式
repeats_pattern = r'(<div id="auth-section">.*?</div>)(\s*<div id="auth-section">.*?</div>)+'

# 遍历所有HTML文件进行清理
for file_path in html_files:
    if os.path.exists(file_path):
        print(f"正在清理文件: {file_path}")
        
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 查找并替换重复的auth-section div
        if '<div id="auth-section">' in content:
            # 使用正则表达式找到所有重复的auth-section div
            match = re.search(repeats_pattern, content, re.DOTALL)
            if match:
                # 只保留第一个auth-section div
                cleaned_content = re.sub(repeats_pattern, r'\1', content, flags=re.DOTALL)
                # 检查是否还有更深层次的重复
                while re.search(repeats_pattern, cleaned_content, re.DOTALL):
                    cleaned_content = re.sub(repeats_pattern, r'\1', cleaned_content, flags=re.DOTALL)
                content = cleaned_content
                print(f"  已清理重复的auth-section div")
            else:
                print(f"  未发现重复的auth-section div")
        
        # 保存修改后的文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"已成功清理文件: {file_path}")
    else:
        print(f"文件不存在: {file_path}")

print("所有文件清理完成！")